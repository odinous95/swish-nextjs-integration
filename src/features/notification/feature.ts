import { resend } from "@/services/resend";
import { createRepository } from "./repository";
import { createService } from "./service";
import { Resend } from "./types";

function craeteFeature(resend: Resend) {
  const repository = createRepository();
  const service = createService(repository, resend);
  return {
    service,
  };
}

export const notificationFeature = craeteFeature(resend);
