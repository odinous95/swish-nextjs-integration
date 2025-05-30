export type ORDER = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  comment?: string;
  floor?: string;
  doorCode?: string;
  deliveryDate: Date;
  cartItems: CartItem[]; // You should already have a CartItem type defined
  total: number;
  deviceType: string;
  campaignCode?: string;
  discount?: number;
  discountApplied?: boolean;
  deliveryTimeWindow?: string; // e.g. "Fredag 30/5 (08:00 – 13:00)"
};

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isExtra?: boolean;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
