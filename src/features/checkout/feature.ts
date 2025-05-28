import { createRepository } from "./repository";
import { createService } from "./service";
function craeteFeature() {
  const repository = createRepository();
  const service = createService(repository);
  return {
    service,
  };
}

export const checkoutFeature = craeteFeature();
