import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const whatsappLoginSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number").max(15, "Phone number is too long"),
});

export const whatsappVerifySchema = z.object({
  phone: z.string(),
  code: z.string().length(6, "OTP code must be 6 digits"),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type WhatsappLoginInput = z.infer<typeof whatsappLoginSchema>;
export type WhatsappVerifyInput = z.infer<typeof whatsappVerifySchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
