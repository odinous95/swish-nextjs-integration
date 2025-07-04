"use server";

import { checkoutFeature } from "../feature";
import { CHECKOUT_ERRORS, CheckoutState } from "../types";

export async function submitCheckoutFormAction(
  _prevState: CheckoutState,
  payload: FormData
): Promise<CheckoutState> {
  const raw = Object.fromEntries(payload.entries());

  const checkoutPayload = {
    ...raw,
    email: raw.email as string,
    total_price: parseFloat(raw.total_price as string),
    delivery_fee: parseFloat(raw.delivery_fee as string),
    discount: parseFloat(raw.discount as string),
    discount_applied: raw.discount_applied === "true",
    terms_accepted: raw.terms_accepted === "on",
    device_type: raw.device_type === "mobile" ? "mobile" : "desktop",
    payment_method: raw.payment_method as string,
    payment_status: raw.payment_status as string,
    cart_items: raw.cart_items ? JSON.parse(raw.cart_items as string) : [],
    created_at: new Date(),
  };

  // console.log("Checkout Payload:", checkoutPayload);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  let result;

  try {
    switch (checkoutPayload.payment_method) {
      case "swish":
        result = await checkoutFeature.service.initializeSwishOrder(
          checkoutPayload,
          baseUrl
        );
        break;

      case "card":
      case "klarna":
        result = await checkoutFeature.service.initializeStripeOrder(
          checkoutPayload,
          baseUrl
        );
        break;

      default:
        return {
          success: false,
          status: 400,
          message: "Ogiltig betalningsmetod.",
          errors: {},
          values: checkoutPayload,
        };
    }
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      message: error?.message || "Ett oväntat fel inträffade.",
      errors: {},
      values: checkoutPayload,
    };
  }
  // Check if the result is valid
  if (!result?.success) {
    return {
      success: false,
      status: result.status ?? 400,
      message: result.message ?? "Misslyckades att skicka order.",
      errors: (result.errors as CHECKOUT_ERRORS) ?? {},
      values: checkoutPayload,
    };
  }

  if (
    checkoutPayload.payment_method === "card" ||
    checkoutPayload.payment_method === "klarna"
  ) {
    // Stripe case — only return stripeRedirectUrl
    return {
      success: true,
      status: 200,
      message: result.message || "Omdirigerar till betalning",
      errors: {},
      values: checkoutPayload,
      stripeRedirectUrl: (result as { stripeRedirectUrl?: string })
        .stripeRedirectUrl,
    };
  }

  if (checkoutPayload.payment_method === "swish") {
    // Swish case — return Swish-specific properties
    return {
      success: true,
      status: 200,
      message: result.message || "Order skickad",
      errors: {},
      values: checkoutPayload,
      qrCodeUrl: (result as { qrCodeUrl?: string }).qrCodeUrl,
      swishUrl: (result as { swishUrl?: string }).swishUrl,
      swishId: (result as { swishId?: string }).swishId,
    };
  }

  // Fallback, just in case
  return {
    success: true,
    status: 200,
    message: result.message || "Order skickad",
    errors: {},
    values: checkoutPayload,
  };
}
