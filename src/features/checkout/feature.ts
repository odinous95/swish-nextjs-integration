import { ordersFeature } from "../orders";
import { createRepository } from "./repository";
import { createService } from "./service";
import { SERVICE_METHODS } from "./types";

const serviceMethods = {
  createOrder: ordersFeature.service.createOrder,
};

function craeteFeature(serviceMethods: SERVICE_METHODS) {
  const repository = createRepository();
  const service = createService(repository, serviceMethods);
  return {
    service,
  };
}

export const checkoutFeature = craeteFeature(serviceMethods);
