import { db } from "@/drizzle-db/db";
import { sql } from "drizzle-orm";
import { ORDER } from "./types";
export function createRepository() {
  async function createOrderDb(order: ORDER) {
    try {
      await db.execute(sql`
            INSERT INTO orders (
              first_name, last_name, email, phone, address, postal_code, city,
              delivery_date, payment_method, swish_id, payment_status, total_price,
              terms_accepted, created_at, comment, floor, door_code, extra_comment,
              discount, delivery_fee, discount_applied, campaign_code, swish_url, qr_code_url
            ) VALUES (
              ${order.firstName}, ${order.lastName}, ${order.email}, ${
        order.phone
      },
              ${order.address}, ${order.postalCode}, ${order.city}, ${
        order.deliveryDate
      },
              ${order.paymentMethod}, ${order.swishId ?? null}, 'PAID', ${
        order.totalPrice
      },
              ${order.termsAccepted}, now(), '', '', '', '',
              ${order.discount ?? 0}, ${order.deliveryFee ?? 0}, ${
        order.discountApplied ?? false
      },
              ${order.campaignCode ?? ""}, ${order.swishUrl ?? ""}, ${
        order.qrCodeUrl ?? ""
      }
            );
          `);
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order.");
    }
  }
  return {
    createOrderDb,
  };
}
export type Repository = ReturnType<typeof createRepository>;
