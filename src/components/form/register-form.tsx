"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { callerRegistrationSchema } from "@/validation";
import { useRegistration } from "@/hooks";
import { toast } from "../ui/toast";
import { getErrorMessage } from "@/lib/get-error-message";
import { Spinner } from "../ui/spinner";
import GoogleLoginComponent from "../models/google-login/GoogleLogin";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  type CallerDefaultValues = z.infer<typeof callerRegistrationSchema>;

  const defaultValues: CallerDefaultValues = {
    name: "Karim Ahmed",
    email: "karim@example.com",
    password: "Password123!",
    confirmPassword: "Password123!",
    contactNumber: "01712345678",
  };

  const { mutate: registration, isPending } = useRegistration();

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: callerRegistrationSchema,
    },
    onSubmit: async ({ value }) => {
      const registrationData = {
        name: value.name,
        email: value.email,
        password: value.password,
        caller: {
          contactNumber: value.contactNumber,
        },
      };

      registration(registrationData, {
        onSuccess: (res) => {
          if (res) {
            toast.add({
              title: "Registration Successful",
              description: "Please verify your account",
              type: "success",
            });
            const params = new URLSearchParams({
              email: registrationData.email,
            });
            router.push(`/register/account-verify?${params.toString()}`);
          }
        },
        onError: (err) => {
          toast.add({
            title: "Registration Failed",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      });
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {/* Full Name */}
      <form.Field name="name">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Full name</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Enter your full name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="name"
                  className="h-11 pl-10"
                />
              </div>
              {isInvalid && (
                <p className="text-xs text-destructive">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Email Address */}
      <form.Field name="email">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
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
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="email"
                  className="h-11 pl-10"
                />
              </div>
              {isInvalid && (
                <p className="text-xs text-destructive">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Contact Number */}
      <form.Field name="contactNumber">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Phone number</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id={field.name}
                  name={field.name}
                  type="tel"
                  placeholder="01712345678"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="tel"
                  className="h-11 pl-10"
                />
              </div>
              {isInvalid && (
                <p className="text-xs text-destructive">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Password */}
      <form.Field name="password">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Password</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="new-password"
                  className="h-11 pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {isInvalid ? (
                <p className="text-xs text-destructive">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Use at least 8 characters.
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Confirm Password */}
      <form.Field name="confirmPassword">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Confirm password</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id={field.name}
                  name={field.name}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="new-password"
                  className="h-11 pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {isInvalid && (
                <p className="text-xs text-destructive">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Submit Button */}
      {isPending ? (
        <Button
          type="submit"
          disabled
          className="h-11 w-full font-medium shadow-sm"
        >
          <Spinner />
          Creating Account...
        </Button>
      ) : (
        <Button type="submit" className="h-11 w-full font-medium shadow-sm">
          Create Account
        </Button>
      )}

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
        <GoogleLoginComponent
          onSuccess={() => {
            router.push("/");
          }}
        />
      </div>
    </form>
  );
}
