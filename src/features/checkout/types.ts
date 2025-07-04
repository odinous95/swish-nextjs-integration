import { ORDER } from "../orders/types";

export type DeliveryDateType = {
  dayName: string;
  date: string;
  fullDate: Date;
  deliveryTime: string;
};

export type SwishResponse = {
  deeplink: string;
  token?: string;
};
export type CheckoutState = {
  success: boolean;
  status: number | null;
  message: string | null;
  errors: CHECKOUT_ERRORS;

  // Optional payloads
  values?: any;
  payload?: any;
  intialSate?: any;

  // Stripe-specific
  stripeRedirectUrl?: string;

  // Swish-specific
  qrCodeUrl?: string;
  swishId?: string;
  swishUrl?: string;
};

export type CHECKOUT_ERRORS = {
  total_price?: string[];
  delivery_fee?: string[];
  discount?: string[];
  discount_applied?: string[];
  terms_accepted?: string[];
  device_type?: string[];
  payment_method?: string[];
  cart_items?: string[];
  first_name?: string[];
  last_name?: string[];
  email?: string[];
  phone_number?: string[];
  address?: string[];
  postal_code?: string[];
  city?: string[];
  company_name?: string[];
  company_org_nr?: string[];
  campaign_code?: string[];
};

export type CheckoutResult = {
  success: boolean;
  status: number;
  message: string;
  errors: CHECKOUT_ERRORS;
  swishUrl?: string;
  swishId?: string;
  qrCodeUrl?: string;
  stripeRedirectUrl?: string;
};

export type CheckoutFormData = {
  first_name: string;
  last_name: string;
  address: string;
  postal_code: string;
  city: string;
  phone: string;
  email: string;
  comment?: string;
  door_code?: string;
  floor?: string;
  terms_accepted: boolean;
};

export type SERVICE_METHODS = {
  createOrder: (
    order: ORDER
  ) => Promise<
    | { success: boolean; orderId: any; error?: undefined }
    | { success: boolean; error: string; orderId?: undefined }
  >;
};
