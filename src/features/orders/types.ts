export type ORDER = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  extra_comment?: string;
  floor?: string;
  door_code?: string;

  cart_items: CartItem[]; // You should already have a CartItem type defined
  total_price: number;
  device_type: string;
  campaign_code?: string;
  discount?: number;
  discount_applied?: boolean;
  payment_method?: string; // e.g. "CARD", "SWISH", etc.
  delivery_time_window?: string; // e.g. "Fredag 30/5 (08:00 – 13:00)"
  delivery_date: Date;
  terms_accepted?: boolean; // true if the user has accepted terms and conditions
  request_id?: string; // For Swish payment requests
  payment_status: string;
  created_at?: Date; // Timestamp of when the order was created
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
