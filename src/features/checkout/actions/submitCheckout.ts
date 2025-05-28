import { checkoutFeature } from "../feature";
import { CHECKOUT_ERRORS } from "../types";

export async function submitCheckoutFormAction(
  preState: any,
  payload: FormData
) {
  const raw = Object.fromEntries(payload.entries());
  const checkoutPayLoad = {
    ...raw,
    totalPrice: parseFloat(raw.totalPrice as string),
    deliveryFee: parseFloat(raw.deliveryFee as string),
    discount: parseFloat(raw.discount as string),
    discountApplied: raw.discountApplied === "true",
    termsAccepted: raw.termsAccepted === "on",
    deviceType: raw.deviceType === "mobile" ? "mobile" : "desktop",
  };

  console.log("Checkout Payload:", checkoutPayLoad);
  const result = await checkoutFeature.service.submitOrder(checkoutPayLoad);
  return {
    success: result.success,
    status: result.status,
    message: result.message || "Ett fel inträffade. Försök igen.",
    errors: result.errors as CHECKOUT_ERRORS,
    payload,
  };
}
