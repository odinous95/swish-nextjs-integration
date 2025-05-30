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
  async function getAllOrders() {
    try {
      const orders = await repository.getAllOrdersDb();
      console.log("Orders fetched successfully:", orders);
      return { success: true, orders };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { success: false, error: "Failed to fetch orders." };
    }
  }
  return {
    createOrder,
    getAllOrders,
  };
}
