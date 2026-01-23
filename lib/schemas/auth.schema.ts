import { z } from "zod";

// Sign In Schema (email + password for Better Auth)
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

// Sign Up Schema
export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

// Auth User Schema (from backend response)
export const authUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().nullable().optional(),
  role: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

// Backend Auth Response Schema
export const backendAuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  token: z.string(),
  refreshToken: z.string().optional(),
  tokenType: z.string().optional(),
  expiresIn: z.number().optional(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    email: z.string().optional(),
    role: z.string().optional(),
    permissions: z.array(z.string()).optional(),
  }),
  timestamp: z.string().optional(),
});

export type BackendAuthResponse = z.infer<typeof backendAuthResponseSchema>;
