"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Check,
  Code2,
  Eye,
  EyeOff,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { signUpAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type SignUpFormValues, signUpSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

function PasswordStrengthIndicator({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
  ];

  const strength = checks.filter((c) => c.met).length;

  return (
    <div className="bg-muted/50 flex flex-col gap-2.5 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                strength >= level
                  ? strength <= 2
                    ? "bg-destructive"
                    : strength === 3
                      ? "bg-warning"
                      : "bg-success"
                  : "bg-border"
              )}
            />
          ))}
        </div>
        <span className="text-muted-foreground text-xs font-medium">
          {strength === 0
            ? ""
            : strength <= 2
              ? "Weak"
              : strength === 3
                ? "Good"
                : "Strong"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5 text-xs">
            {check.met ? (
              <Check className="text-success h-3 w-3 shrink-0" />
            ) : (
              <X className="text-muted-foreground/50 h-3 w-3 shrink-0" />
            )}
            <span
              className={cn(
                "transition-colors",
                check.met ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: undefined,
    },
  });

  const passwordValue = useWatch({ control, name: "password" });
  const agreeToTerms = useWatch({ control, name: "agreeToTerms" });

  async function onSubmit(data: SignUpFormValues) {
    setIsLoading(true);
    const result = await signUpAction(data);
    if (result.success) {
      toast.success("Account created successfully");
      router.push("/sign-in");
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Heading */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-6 flex items-center gap-2.5">
            <div className="bg-primary shadow-primary/25 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
              <Code2 className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="text-foreground text-xl font-bold tracking-tight">
              DevShowcase
            </span>
          </Link>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Join the community and showcase your projects
          </p>
        </div>

        <Card className="border-border/60 shadow-xl shadow-black/5">
          {/* <CardHeader className="pb-2">
            <CardTitle className="sr-only">Sign Up</CardTitle> */}
          {/* <CardDescription className="sr-only">
              Create a new account to get started
            </CardDescription> */}
          {/* Social Login */}
          {/* <div className="flex gap-3">
              <Button
                variant="outline"
                className="h-11 flex-1 gap-2 bg-transparent text-sm font-medium"
                type="button"
              >
                <Github className="h-4.5 w-4.5" />
                GitHub
              </Button>
              <Button
                variant="outline"
                className="h-11 flex-1 gap-2 bg-transparent text-sm font-medium"
                type="button"
              >
                <svg
                  className="h-4.5 w-4.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </div> */}
          {/* </CardHeader> */}

          {/* <div className="relative px-6">
            <div className="absolute inset-0 flex items-center px-6">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-3">
                or continue with email
              </span>
            </div>
          </div> */}

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col gap-4 pt-2">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  className={
                    errors.fullName
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-destructive text-xs">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={
                    errors.email
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-destructive text-xs">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className={
                      errors.password
                        ? "border-destructive focus-visible:ring-destructive pr-10"
                        : "pr-10"
                    }
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
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
                {errors.password && (
                  <p className="text-destructive text-xs">
                    {errors.password.message}
                  </p>
                )}
                {passwordValue && (
                  <PasswordStrengthIndicator password={passwordValue} />
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className={
                      errors.confirmPassword
                        ? "border-destructive focus-visible:ring-destructive pr-10"
                        : "pr-10"
                    }
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="agreeToTerms"
                    checked={agreeToTerms === true}
                    onCheckedChange={(checked) =>
                      setValue(
                        "agreeToTerms",
                        checked === true
                          ? true
                          : (undefined as unknown as true),
                        { shouldValidate: true }
                      )
                    }
                    className={errors.agreeToTerms ? "border-destructive" : ""}
                  />
                  <Label
                    htmlFor="agreeToTerms"
                    className="text-muted-foreground cursor-pointer text-sm leading-snug font-normal"
                  >
                    I agree to the{" "}
                    <Link
                      href="#"
                      className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-destructive text-xs">
                    {errors.agreeToTerms.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="mt-4 flex flex-col gap-4">
              <Button
                type="submit"
                className="h-11 w-full gap-2 text-sm font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-muted-foreground text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
