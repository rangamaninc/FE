import { z } from "zod";

/** Reusable validation patterns for forms across the app. */
export const validationPatterns = {
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
  requiredString: (label = "This field") =>
    z.string().trim().min(1, `${label} is required`),
  optionalString: z.string().optional(),
  positiveNumber: z.coerce.number().positive("Must be greater than zero"),
};

export const signInSchema = z.object({
  email: validationPatterns.email,
  password: validationPatterns.requiredString("Password"),
});
