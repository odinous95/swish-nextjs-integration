import { z } from "zod";

export const OrderSchema = z.object({
  first_name: z.string().min(2, "Förnamn är obligatoriskt"),
  last_name: z.string().min(2, "Efternamn är obligatoriskt"),
  address: z.string().min(1, "Adress är obligatoriskt"),
  postal_code: z.string().regex(/^(70[0-3][0-9]{2})$/, {
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
  door_code: z.string().optional(),
  floor: z.string().optional(),
  extra_comment: z.string().optional(),
  delivery_date: z.string().min(1, "DeliveryDate är obligatoriskt"),
  payment_method: z.string().min(1, "Betalningsmetod är obligatoriskt"),
  campaign_code: z.string().optional(),
  terms_accepted: z.union([z.literal(true), z.literal("on")]),
  total_price: z.number().min(0),
  delivery_fee: z.number().min(0),
  discount: z.number().min(0),
  discount_applied: z.boolean(),
  device_type: z.enum(["mobile", "desktop"]),
  created_at: z.date().optional(),
  payment_status: z
    .string()
    .min(1, "Betalningsstatus är obligatorisk")
    .default("pending"), // Default to "pending" if not provided
  cart_items: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().min(1),
        isExtra: z.boolean().optional(),
      })
    )
    .min(1, "Varukorgen kan inte vara tom"),
});
//--------------------------------------------
export type OrderSchema = z.infer<typeof OrderSchema>;
