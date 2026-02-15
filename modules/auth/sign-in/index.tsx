"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/stores/auth.store";
import { signInSchema, type SignInFormData } from "@/lib/schemas/auth.schema";
import { backendAuthResponseSchema } from "@/lib/schemas/auth.schema";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      // Call Spring Boot backend directly using centralized auth API client
      const response = await authApiClient
        .post("api/v1/auth/login", {
          json: {
            userName: data.username,
            password: data.password,
          },
        })
        .json<unknown>();

      // Validate response with Zod
      const parseResult = backendAuthResponseSchema.safeParse(response);
      if (!parseResult.success) {
        console.error("Invalid backend response:", parseResult.error);
        throw new Error("Invalid credentials");
      }

      const authResponse = parseResult.data;

      // Map backend AuthResponse.user into frontend AuthUser shape
      const authUser = {
        id: authResponse.user.id.toString(),
        name: authResponse.user.username,
        email: authResponse.user.email ?? `${authResponse.user.username}@blurapp.com`,
        image: null,
        role: authResponse.user.role,
        permissions: authResponse.user.permissions ?? [],
        accessToken: authResponse.token,
        refreshToken: authResponse.refreshToken,
      };

      // Persist httpOnly cookies for server/middleware access
      await fetch('/api/session/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: authResponse.token,
          refreshToken: authResponse.refreshToken,
          expiresIn: authResponse.expiresIn,
        }),
      });

      setUser(authUser);

      toast.success("Successfully signed in!");
      router.push("/dashboard");
    } catch (error) {
      let errorMessage = "An error occurred during sign in";

      if (error instanceof Error) {
        if (error.message === "Failed to fetch") {
          errorMessage =
            "Unable to connect to the authentication service. Please check your internet connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Sign in to your Blur account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  {...register("username")}
                  disabled={isSubmitting}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Blur</h2>
                <p className="text-muted-foreground">
                  Race management made simple
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </div>
    </div>
  );
}
