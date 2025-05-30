import { orders } from "./schema";
import { ORDER } from "./types";
import { db } from "@/drizzle-db/db";

export function createRepository() {
  async function createOrderDb(order: ORDER) {
    try {
      // Convert deliveryDate string to a Date object
      const deliveryDateAsDate = new Date(order.deliveryDate);

      // Using Drizzle's insert method for type-safe and automatic parameterization
      await db.insert(orders).values({
        first_name: order.firstName,
        last_name: order.lastName,
        email: order.email,
        phone: order.phone,
        address: order.address,
        postal_code: order.postalCode,
        city: order.city,
        comment: order.comment, // Drizzle handles null/undefined correctly
        floor: order.floor, // Drizzle handles null/undefined correctly
        door_code: order.doorCode, // Drizzle handles null/undefined correctly
        delivery_date: deliveryDateAsDate, // Pass the converted Date object
        delivery_time_window: order.deliveryTimeWindow, // Drizzle handles null/undefined correctly
        total_price: order.total?.toString(), // Ensure string if schema expects string
        campaign_code: order.campaignCode, // Drizzle handles null/undefined correctly
        discount: order.discount, // Drizzle handles null/undefined correctly
        discount_applied: order.discountApplied, // Drizzle handles null/undefined correctly
        created_at: new Date(), // Use JavaScript Date object for 'now()'
      });

      console.log("Order created successfully!");
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
