"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, UserCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks";
import { loginSchema } from "@/validation";
import { toast } from "../ui/toast";
import { getErrorMessage } from "@/lib/get-error-message";
import { FieldError, FieldGroup } from "../ui/field";
import { Spinner } from "../ui/spinner";
import GoogleLoginComponent from "../models/google-login/GoogleLogin";

// Demo accounts data aligned with Roles (ADMIN, DISPATCHER, DRIVER, CALLER)
const DEMO_ACCOUNTS = [
  {
    role: "ADMIN",
    email: "superadmin@gmail.com",
    password: "Super@admin12345",
  },
  {
    role: "DISPATCHER",
    email: "dispatcher@gmail.com",
    password: "Dispatcher@12345",
  },
  {
    role: "DRIVER",
    email: "driver@gmail.com",
    password: "Driver@12345",
  },
  {
    role: "CALLER",
    email: "caller@gmail.com",
    password: "Caller@12345",
  },
];

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Debug: Log the callbackUrl
  console.log("LoginForm - callbackUrl:", callbackUrl);

  const { mutate: login, isPending: loginPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    validators: {
      onSubmit: loginSchema,
    },

    onSubmit: ({ value }) => {
      const loginData = {
        email: value.email,
        password: value.password,
      };

      login(loginData, {
        onSuccess: () => {
          console.log("Login successful, redirecting to:", callbackUrl);

          toast.add({
            title: "Login Success",
            description: "Welcome back",
            type: "success",
          });

          // Use window.location.href for reliable redirect with callbackUrl
          // Add a small delay to ensure toast is visible
          setTimeout(() => {
            window.location.href = callbackUrl;
          }, 500);
        },

        onError: (err) => {
          toast.add({
            title: "Authorization failure",
            description:
              getErrorMessage(err) || "Something went wrong. Please try again",
            type: "error",
          });
        },
      });
    },
  });

  const handleDemoFill = (email: string, password: string) => {
    form.setFieldValue("email", email);
    form.setFieldValue("password", password);
    toast.add({
      title: "Demo credentials filled",
      description: `Filled credentials for ${email}`,
      type: "info",
    });
  };

  return (
    <div className="space-y-6">
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          {/* Email */}
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email address</Label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="h-11 pl-10"
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                  </div>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>

          {/* Password */}
          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={field.name}>Password</Label>

                    <form.Subscribe selector={(state) => state.values.email}>
                      {(email) => (
                        <Link
                          href={
                            email
                              ? `/forgot-password?${new URLSearchParams({ email }).toString()}`
                              : "/forgot-password"
                          }
                          className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                        >
                          Forgot password?
                        </Link>
                      )}
                    </form.Subscribe>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-11 pl-10 pr-10"
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-input accent-destructive"
            />

            <Label
              htmlFor="remember"
              className="cursor-pointer text-sm font-normal text-muted-foreground"
            >
              Remember me
            </Label>
          </div>

          {/* Submit */}
          <Button
            disabled={loginPending}
            type="submit"
            className="h-11 w-full font-medium shadow-sm"
          >
            {loginPending ? (
              <>
                <Spinner />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </FieldGroup>
      </form>

      {/* OR Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <span className="relative bg-background px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Or continue with
        </span>
      </div>

      {/* Google Login */}
      <div className="flex justify-center">
        <GoogleLoginComponent />
      </div>

      {/* Demo Credentials Quick Fill Section */}
      <div className="space-y-3 pt-2">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <span className="relative bg-background px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Quick Demo Login
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <Button
              key={acc.role}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDemoFill(acc.email, acc.password)}
              className="flex items-center justify-center gap-1.5 h-9 text-xs font-medium"
            >
              <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
              {acc.role}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
