"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get("email") || "";

  const [email, setEmail]           = useState(prefillEmail);
  const [otp, setOtp]               = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);

  const [errors, setErrors] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });
  const [touched, setTouched] = useState({ email: false, otp: false, newPassword: false, confirmPassword: false });

  const validate = () => {
    const e = {
      email: !email.trim()
        ? "Email is required."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ? "Enter a valid email."
        : "",
      otp: !otp.trim()
        ? "OTP is required."
        : !/^\d{6}$/.test(otp.trim())
        ? "OTP must be 6 digits."
        : "",
      newPassword: !newPassword
        ? "New password is required."
        : newPassword.length < 8
        ? "Password must be at least 8 characters."
        : "",
      confirmPassword: !confirmPassword
        ? "Please confirm your password."
        : confirmPassword !== newPassword
        ? "Passwords do not match."
        : "",
    };
    setErrors(e);
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, otp: true, newPassword: true, confirmPassword: true });
    const errs = validate();
    if (Object.values(errs).some(Boolean)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/proxy/v1/vendors/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim(), new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Something went wrong.");
      setDone(true);
      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field: keyof typeof errors) =>
    touched[field] && errors[field]
      ? "border-red-500 focus-visible:ring-red-500"
      : touched[field] && !errors[field]
      ? "border-green-500 focus-visible:ring-green-500"
      : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-12 overflow-y-auto">
      <style jsx global>{`
        input::-ms-reveal, input::-ms-clear { display: none; }
      `}</style>

      <div className="w-full max-w-md relative">
        {/* Floating Logo */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10">
          <div className="h-14 w-14 rounded-lg bg-white p-1 shadow-md border border-border/50 overflow-hidden relative">
            <div className="h-full w-full relative rounded-md overflow-hidden">
              <Image src="/ra_logo.png" alt="Vendor Portal" fill priority className="object-cover" />
            </div>
          </div>
        </div>

        <Card className="w-full shadow-lg border-0 pt-6">
          <CardHeader className="items-center pb-0 pt-2">
            <h4 className="text-2xl font-bold tracking-tight text-[#071437]">Reset Password</h4>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {done ? "Your password has been reset." : "Enter the OTP sent to your email and set a new password."}
            </p>
          </CardHeader>

          <CardContent className="pb-6">
            {done ? (
              <div className="mt-6 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="text-green-500 w-7 h-7" />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Redirecting to login…
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-3 mt-4">
                {/* Email */}
                <div className="space-y-0.5">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vendor@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                    onBlur={() => { setTouched((p) => ({ ...p, email: true })); validate(); }}
                    className={`rounded-sm ${fieldClass("email")}`}
                  />
                  {touched.email && errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* OTP */}
                <div className="space-y-0.5">
                  <Label htmlFor="otp" className="text-xs">OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setErrors((p) => ({ ...p, otp: "" })); }}
                    onBlur={() => { setTouched((p) => ({ ...p, otp: true })); validate(); }}
                    className={`rounded-sm tracking-[0.3em] font-mono ${fieldClass("otp")}`}
                  />
                  {touched.otp && errors.otp && <p className="text-xs text-red-500">{errors.otp}</p>}
                </div>

                {/* New Password */}
                <div className="space-y-0.5">
                  <Label htmlFor="newPassword" className="text-xs">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: "", confirmPassword: "" })); }}
                      onBlur={() => { setTouched((p) => ({ ...p, newPassword: true })); validate(); }}
                      className={`pr-10 rounded-sm ${fieldClass("newPassword")}`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowNew((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {touched.newPassword && errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-0.5">
                  <Label htmlFor="confirmPassword" className="text-xs">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
                      onBlur={() => { setTouched((p) => ({ ...p, confirmPassword: true })); validate(); }}
                      className={`pr-10 rounded-sm ${fieldClass("confirmPassword")}`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full uppercase tracking-widest font-semibold h-9 mt-1"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>

                <div className="text-center pt-1">
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium flex items-center justify-center gap-1.5">
                    <ArrowLeft size={14} /> Resend OTP
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
