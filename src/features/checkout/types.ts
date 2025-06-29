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
  intialSate?: any;
  errors: CHECKOUT_ERRORS;
  payload?: any;
  qrCodeUrl?: string;
  swishId?: string | null;
  swishUrl?: string;
  values?: any;
};

export type CHECKOUT_ERRORS = {
  firstName?: string;
  lastName?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  email?: string;
  comment?: string;
  doorCode?: string;
  floor?: string;
  deliveryDate?: string;
  paymentMethod?: string;
  campaignCode?: string;
  extraComment?: string;

  termsAccepted?: string;
};
export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  comment?: string;
  doorCode?: string;
  floor?: string;
  termsAccepted: boolean;
};

export type SERVICE_METHODS = {};
