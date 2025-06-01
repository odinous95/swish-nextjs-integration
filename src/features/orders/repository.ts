import { ORDER } from "./types";
import { sql } from "@/drizzle-db/db";

export function createRepository() {
  async function createOrderDb(order: ORDER) {
    try {
      const deliveryDateAsDate = new Date(order.deliveryDate);

      const result = await sql`
      INSERT INTO orders (
        first_name, last_name, email, phone, address,
        postal_code, city, comment, floor, door_code,
        delivery_date, delivery_time_window, total_price,
        campaign_code, discount, discount_applied, created_at,
        payment_method, terms_accepted
      )
      VALUES (
        ${order.firstName}, ${order.lastName}, ${order.email}, ${order.phone}, ${order.address},
        ${order.postalCode}, ${order.city}, ${order.comment ?? null}, ${order.floor ?? null}, ${order.doorCode ?? null},
        ${deliveryDateAsDate}, ${order.deliveryTimeWindow ?? null}, ${order.total?.toString() ?? null},
        ${order.campaignCode ?? null}, ${order.discount ?? null}, ${order.discountApplied ?? null}, ${new Date()},
        ${order.paymentMethod ?? "CARD"}, ${order.termsAccepted ?? false}
      )
      RETURNING id
    `;

      const orderId = result[0]?.id;
      console.log("Order created successfully with ID:", orderId);
      return orderId; // 👈 Return the generated order ID
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order.");
    }
  }
  async function getAllOrdersDb() {
    try {
      const orders = await sql`
        SELECT * FROM orders
        ORDER BY created_at DESC
      `;
      // console.log("Orders fetched successfully:", orders);
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Failed to fetch orders.");
    }
  }
  return {
    createOrderDb,
    getAllOrdersDb,
  };
}

export type Repository = ReturnType<typeof createRepository>;
