import { ORDER } from "./types";
import { sql } from "@/drizzle-db/db";

export function createRepository() {
  async function createOrderDb(order: ORDER) {
    try {
      const deliveryDateAsDate = new Date(order.delivery_date);
      const created_at = new Date(order.created_at ?? new Date());

      const result = await sql`
  INSERT INTO orders (
    first_name, last_name, email, phone, address, cart_items,
    postal_code, city, extra_comment, floor, door_code,
    delivery_date, total_price,
    campaign_code, discount, discount_applied, created_at,
    payment_method, terms_accepted, payment_status
  )
  VALUES (
    ${order.first_name}, ${order.last_name}, ${order.email}, ${order.phone}, ${order.address},
    ${JSON.stringify(order.cart_items)},
    ${order.postal_code}, ${order.city}, ${order.extra_comment ?? null}, ${order.floor ?? null}, ${order.door_code ?? null},
    ${deliveryDateAsDate}, ${order.total_price ?? null},
    ${order.campaign_code ?? null}, ${order.discount ?? null}, ${order.discount_applied ?? null}, ${created_at},
    ${order.payment_method ?? "CARD"}, ${order.terms_accepted ?? false}, ${order.payment_status ?? ""}
  )
  RETURNING id
`;

      const orderId = result[0]?.id;
      console.log("Order created successfully with ID:", orderId);
      return orderId;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order.");
    }
  }
  async function getOrderByIdDb(orderId: number) {
    try {
      const order = await sql`
        SELECT * FROM orders
        WHERE id = ${orderId}
      `;

      if (order.length === 0) {
        console.warn(`Order with ID ${orderId} not found.`);
        return null;
      }

      // console.log("Order fetched successfully:", order[0]);
      return order[0];
    } catch (error) {
      console.error("Error fetching order:", error);
      throw new Error("Failed to fetch order.");
    }
  }
  async function updateOrderPaymentStatus(
    orderId: number,
    payment_status: string
  ) {
    try {
      const updatedOrder = await sql`
        UPDATE orders
        SET payment_status = ${payment_status}
        WHERE id = ${orderId}
        RETURNING *
      `;

      if (updatedOrder.length === 0) {
        console.warn(`Order with ID ${orderId} not found for update.`);
        return null;
      }

      // console.log("Order updated successfully:", updatedOrder[0]);
      return updatedOrder[0];
    } catch (error) {
      console.error("Error updating order:", error);
      throw new Error("Failed to update order.");
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
    getOrderByIdDb,
    updateOrderPaymentStatus,
    getAllOrdersDb,
  };
}

export type Repository = ReturnType<typeof createRepository>;
