import { z } from "zod";

export const OrderSchema = z.object({
  firstName: z.string().min(2, "Förnamn är obligatoriskt"),
  lastName: z.string().min(2, "Efternamn är obligatoriskt"),
  address: z.string().min(1, "Adress är obligatoriskt"),
  postalCode: z.string().regex(/^(70[0-3][0-9]{2})$/, {
    message: "Postnummer måste vara ett giltigt Örebro-postnummer",
  }),
  city: z
    .string()
    .toLowerCase()
    .refine((val) => val === "örebro", {
      message: "Stad måste vara Örebro.",
    }),
  phone: z.string().min(6, "Telefonnummer är obligatoriskt"),
  email: z.string().email("Ogiltig e-postadress"),
  comment: z.string().optional(),
  doorCode: z.string().optional(),
  floor: z.string().optional(),
  extraComment: z.string().optional(),
  deliveryDate: z.string().min(1, "DeliveryDate är obligatoriskt"),
  paymentMethod: z.string().min(1, "Betalningsmetod är obligatoriskt"),
  campaignCode: z.string().optional(),
  termsAccepted: z.union([z.literal(true), z.literal("on")]),
  totalPrice: z.number().min(0),
  deliveryFee: z.number().min(0),
  discount: z.number().min(0),
  discountApplied: z.boolean(),
  deviceType: z.enum(["mobile", "desktop"]),
});
//--------------------------------------------
export type OrderSchema = z.infer<typeof OrderSchema>;
