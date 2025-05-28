import { z } from "zod";

const nameSchema = z
  .string()
  .min(3, "Name must be at least 3 characters long")
  .max(40, "Name must be at most 40 characters long");

const emailSchema = z.string().email("Correct email is required");

const passwordSchema = z.string();
export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const userIdSchema = z.object({
  userId: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "userId must be a valid number" }),
});

export const platformSchema = z.object({
  userId: z.number(),
  platformName: nameSchema,
  platformUrl: z.string().url(),
});

export const imageFileSchema = z.object({
  type: z.string().refine((type) => type.startsWith("image/"), {
    message: "Please upload a valid image file.",
  }),
  size: z.number().max(5 * 1024 * 1024, {
    message: "File size exceeds 5MB. Please select a smaller file.",
  }),
  name: z.string().min(1, {
    message: "File name cannot be empty.",
  }),
});

//--------------------------------------------
export type SignUpFieldValues = z.infer<typeof signUpSchema>;
export type SignInFieldValues = z.infer<typeof signInSchema>;
