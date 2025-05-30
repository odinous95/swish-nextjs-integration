"use server";
import { checkoutFeature } from "../feature";
import { CHECKOUT_ERRORS, CheckoutState } from "../types";

export async function submitCheckoutFormAction(
  preState: CheckoutState,
  payload: FormData
): Promise<CheckoutState> {
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
  const result = await checkoutFeature.service.intializeOrder(checkoutPayLoad);
  console.log("Checkout Result:", result);
  if (!result?.success) {
    return {
      success: result?.success || false,
      status: result?.status || 400,
      message: result?.message || "Failed to submit order",
      errors: result?.errors as CHECKOUT_ERRORS, // or map errors properly here
      values: Object.fromEntries(payload),
    };
  }

  return {
    success: true,
    status: 200,
    message: result.message || "Order submitted",
    errors: {} as CHECKOUT_ERRORS,
    qrCodeUrl: result.qrCodeUrl || undefined,
    swishId: result.swishId || null,
    swishUrl: result.swishUrl || undefined,
    values: checkoutPayLoad, // 👈 Add this
  };
}
