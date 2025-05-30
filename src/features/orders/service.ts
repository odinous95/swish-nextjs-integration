import { Repository } from "./repository";
import { ORDER } from "./types";

export function createService(repository: Repository) {
  async function createOrder(order: ORDER) {
    try {
      await repository.createOrderDb(order);
      return { success: true };
    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false, error: "Failed to create order." };
    }
  }
  return {
    createOrder,
  };
}
