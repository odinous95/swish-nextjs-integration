import { OrderSchema } from "@/validation/zod-validation";
import { Repository } from "./repository";

export function createService(repository: Repository) {
  async function intializeOrder(payload: any) {
    // console.log("Submitting Order with Payload:", payload);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const validated = OrderSchema.safeParse(payload);
    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      const formattedErrors: Record<string, string[]> = {};
      for (const key in fieldErrors) {
        const typedKey = key as keyof typeof fieldErrors;
        if (fieldErrors[typedKey]) {
          formattedErrors[typedKey as string] = fieldErrors[typedKey]!;
        }
      }
      return {
        success: false,
        status: 400,
        message: "Valideringsfel. Vänligen kontrollera dina inmatningar.",
        errors: formattedErrors,
      };
    }
    const data = validated.data;
    console.log("Validated Order Data:", data);
    if (!data.paymentMethod) {
      return {
        success: false,
        status: 400,
        message: "Vänligen välj betalningsmetod.",
      };
    }
    if (data.paymentMethod === "swish") {
      try {
        const amount = data?.totalPrice;
        const message = `Order ${Date.now()}`;
        const res = await fetch(`${baseUrl}/api/swish/paymentrequests`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, message }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.message || "Unknown error");
        }
        const { token, id } = await res.json();
        if (!token) throw new Error("Swish token saknas");
        if (data.deviceType === "mobile") {
          const swishUrl = `swish://paymentrequest?token=${token}`;
          return {
            success: true,
            status: 200,
            message: "Swish payment request created successfully.",
            swishUrl,
            swishId: id,
          };
        }
        // For desktop, we need to fetch the QR code
        const response = await fetch(
          `${baseUrl}/api/swish/swishqr?token=${token}`
        );
        if (!response.ok) throw new Error(`QR proxy failed ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        // Construct a data URL
        const qrCodeUrl = `data:image/png;base64,${base64}`;
        return {
          success: true,
          status: 200,
          message: "Swish payment request created successfully.",
          qrCodeUrl,
          swishId: id,
        };
      } catch (error: any) {
        return {
          success: false,
          status: 500,
          message: `Fel vid betalning med Swish: ${
            error.message || "Okänt fel"
          }`,
        };
      }
    }
  }
  async function checkSwishPaymentStatus(
    requestId: string
  ): Promise<string | null> {
    if (!requestId) {
      console.error("checkSwishPaymentStatus: requestId is missing or invalid");
      return null;
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    try {
      const response = await fetch(
        `${baseUrl}/api/swish/paymentstatus?requestId=${requestId}`
      );
      if (!response.ok) {
        console.error("Internal API returned error status", response.status);
        return null;
      }
      const data = await response.json();
      const validStatuses = ["PAID", "DECLINED", "ERROR", "CREATED"];
      const status = data.status?.toUpperCase() ?? null;
      if (status && validStatuses.includes(status)) {
        return status;
      }
      return null;
    } catch (error) {
      console.error("Error calling internal Swish API route:", error);
      return null;
    }
  }

  return {
    intializeOrder,
    checkSwishPaymentStatus,
  };
}
