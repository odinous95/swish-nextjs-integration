import { OrderSchema } from "@/validation/zod-validation";
import { Repository } from "./repository";

export function createService(repository: Repository) {
  async function submitOrder(payload: any) {
    console.log("Submitting Order with Payload:", payload);

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
        const res = await fetch("/api/swish/paymentrequests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, message }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.message || "Unknown error");
        }
        const { token, url, id } = await res.json();
        if (!token) throw new Error("Swish token saknas");
        if (data.deviceType === "mobile") {
          const swishUrl = `swish://paymentrequest?token=${token}`;
          return {
            success: true,
            status: 200,
            message: "Swish payment request created successfully.",
            swishUrl,
          };
        }
        const response = await fetch(`/api/swish/swishqr?token=${token}`);
        if (!response.ok) throw new Error(`QR proxy failed ${response.status}`);
        const blob = await response.blob();
        const qrCodeUrl = URL.createObjectURL(blob);
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

  return {
    submitOrder,
  };
}
