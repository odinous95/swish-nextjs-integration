import { Repository } from "./repository";
import { ORDER } from "./types";

export function createService(repository: Repository) {
  async function createOrder(order: ORDER) {
    try {
      const orderId = await repository.createOrderDb(order);
      console.log("Order created successfully:", orderId);
      return { success: true, orderId };
    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false, error: "Failed to create order." };
    }
  }
  return {
    createOrder,
  };
}
