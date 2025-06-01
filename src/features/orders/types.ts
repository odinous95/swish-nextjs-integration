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
  paymentMethod?: string; // e.g. "CARD", "SWISH", etc.
  deliveryTimeWindow?: string; // e.g. "Fredag 30/5 (08:00 – 13:00)"
  termsAccepted?: boolean; // true if the user has accepted terms and conditions
  requestId?: string; // For Swish payment requests
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

export interface OrderButtonProps {
  id: string;
  name?: string;
  price?: number;
  small?: boolean;
  className?: string;
  isHeroButton?: boolean;
  showQuantity?: { [key: string]: boolean };
  quantities?: { [key: string]: number };
  buttonStates?: { [key: string]: boolean };
  handleButtonClick?: (id: string, name: string, price: number) => void;
  adjustQuantity?: (id: string, delta: number) => void;
  scrollToSection?: (id: string) => void;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
