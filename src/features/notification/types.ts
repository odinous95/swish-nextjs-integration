import { Resend as ResendClient } from "resend";

export type Resend = ResendClient;

export type ORDER_DB = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  comment: string | null;
  door_code: string;
  floor: string;
  extra_comment: string;
  delivery_date: string; // ISO date string
  payment_method: string;
  swish_id: string | null;
  swish_url: string | null;
  qr_code_url: string | null;
  payment_status: string;
  total_price: string;
  discount: string;
  delivery_fee: string;
  discount_applied: boolean;
  campaign_code: string;
  terms_accepted: boolean;
  created_at: string; // ISO date string
  cart_items: string; // JSON stringified array
};
