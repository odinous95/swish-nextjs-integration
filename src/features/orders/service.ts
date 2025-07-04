import { Repository } from "./repository";
import { ORDER } from "./types";

export function createService(repository: Repository) {
  async function createOrder(order: ORDER) {
    try {
      const orderId = await repository.createOrderDb(order);
      // console.log("Order created successfully:", orderId);
      return { success: true, orderId };
    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false, error: "Failed to create order." };
    }
  }
  async function getOrderById(orderId: number) {
    try {
      const order = await repository.getOrderByIdDb(orderId);
      if (!order) {
        return { success: false, error: "Order not found." };
      }
      // console.log("Order fetched successfully:", order);
      return { success: true, order };
    } catch (error) {
      console.error("Error fetching order:", error);
      return { success: false, error: "Failed to fetch order." };
    }
  }
  async function updateOrderPaymentStatus(
    orderId: number,
    payment_status: string
  ) {
    try {
      const updatedOrder = await repository.updateOrderPaymentStatus(
        orderId,
        payment_status
      );
      if (!updatedOrder) {
        return { success: false, error: "Order not found." };
      }
      return { success: true, order: updatedOrder };
    } catch (error) {
      console.error("Error updating payment status:", error);
      return { success: false, error: "Failed to update payment status." };
    }
  }
  async function getAllOrders() {
    try {
      const orders = await repository.getAllOrdersDb();
      // console.log("Orders fetched successfully:", orders);
      return { success: true, orders };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { success: false, error: "Failed to fetch orders." };
    }
  }
  return {
    createOrder,
    getOrderById,
    updateOrderPaymentStatus,
    getAllOrders,
  };
}
