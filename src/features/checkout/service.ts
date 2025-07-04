import { OrderSchema } from "@/validation/zod-validation";
import { Repository } from "./repository";
import { SERVICE_METHODS } from "./types";

export function createService(
  repository: Repository,
  serviceMethods: SERVICE_METHODS
) {
  async function initializeSwishOrder(data: any, baseUrl: string) {
    // Validate input data
    const validation = OrderSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        status: 400,
        message: "Valideringsfel. Vänligen kontrollera dina inmatningar.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    // Create the order in DB with status "pending" or "awaiting_payment"
    const createdOrder = await serviceMethods.createOrder({
      ...data,
      paymentStatus: "pending",
    });

    if (!createdOrder || !createdOrder.orderId) {
      return {
        success: false,
        status: 500,
        message: "Kunde inte skapa order i databasen.",
      };
    }

    try {
      const amount = data.total_price;
      const message = createdOrder.orderId;

      const res = await fetch(`${baseUrl}/api/swish/paymentrequests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, message }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || "Unknown Swish error");
      }

      const { token, id } = await res.json();
      if (!token) throw new Error("Swish-token saknas");

      if (data.deviceType === "mobile") {
        const swishUrl = `swish://paymentrequest?token=${token}`;
        return {
          success: true,
          status: 200,
          message: "Swish payment request created successfully.",
          swishUrl,
          swishId: id,
          orderId: createdOrder.orderId,
        };
      }

      // Desktop: fetch QR code
      const qrResponse = await fetch(
        `${baseUrl}/api/swish/swishqr?token=${token}`
      );
      if (!qrResponse.ok)
        throw new Error(`QR-bild hämtning misslyckades: ${qrResponse.status}`);

      const arrayBuffer = await qrResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const qrCodeUrl = `data:image/png;base64,${buffer.toString("base64")}`;

      return {
        success: true,
        status: 200,
        message: "Swish payment request created successfully.",
        qrCodeUrl,
        swishId: id,
        orderId: createdOrder.orderId,
      };
    } catch (error: any) {
      return {
        success: false,
        status: 500,
        message: `Fel vid betalning med Swish: ${error.message || "Okänt fel"}`,
      };
    }
  }

  async function initializeStripeOrder(data: any, baseUrl: string) {
    const validation = OrderSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        status: 400,
        message: "Valideringsfel. Vänligen kontrollera dina inmatningar.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    // Create order in DB with "pending" status
    const createdOrder = await serviceMethods.createOrder({
      ...data,
      payment_status: "pending",
    });

    if (!createdOrder || !createdOrder.orderId) {
      return {
        success: false,
        status: 500,
        message: "Kunde inte skapa order i databasen.",
      };
    }

    try {
      const stripeEndpoint =
        data.payment_method === "card"
          ? "/api/stripe/checkout-session-card"
          : "/api/stripe/checkout-session-klarna";

      // Include order ID in Stripe metadata for webhook tracking
      const res = await fetch(`${baseUrl}${stripeEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total_price: data.total_price,
          email: data.email,
          orderId: createdOrder.orderId,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.url) {
        throw new Error(result.error || "Stripe checkout failed");
      }

      return {
        success: true,
        status: 200,
        stripeRedirectUrl: result.url,
        message: "Redirecting to Stripe...",
        orderId: createdOrder.orderId,
      };
    } catch (error: any) {
      return {
        success: false,
        status: 500,
        message: `Stripe payment error: ${error.message || "Unknown error"}`,
      };
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
        console.error("Swish status fetch failed with:", response.status);
        return null;
      }

      const data = await response.json();
      const status = data.status?.toUpperCase() ?? null;
      const validStatuses = ["PAID", "DECLINED", "ERROR", "CREATED"];

      return validStatuses.includes(status) ? status : null;
    } catch (error) {
      console.error("Error checking Swish payment status:", error);
      return null;
    }
  }

  return {
    initializeSwishOrder,
    initializeStripeOrder,
    checkSwishPaymentStatus,
  };
}
