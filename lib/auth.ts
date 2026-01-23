import { betterAuth } from "better-auth";

// Re-export AuthUser from schemas for convenience
export type { AuthUser } from "@/lib/schemas/auth.schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  
  // Use JWT sessions without database
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Disable database
  database: false,

  // Custom user fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
      permissions: {
        type: "string[]",
        required: false,
      },
      accessToken: {
        type: "string",
        required: false,
      },
      refreshToken: {
        type: "string",
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
