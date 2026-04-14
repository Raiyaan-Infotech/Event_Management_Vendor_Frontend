"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validate = (v: string) => {
    if (!v.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Enter a valid email address.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(email);
    setEmailError(err);
    setTouched(true);
    if (err) return;

    setLoading(true);
    try {
      const res = await fetch("/api/proxy/v1/vendors/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Something went wrong.");
      setSent(true);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-12 overflow-y-auto">
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
            <h4 className="text-2xl font-bold tracking-tight text-[#071437]">Forgot Password</h4>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {sent
                ? "Check your inbox for the OTP."
                : "Enter your email and we'll send you a one-time password."}
            </p>
          </CardHeader>

          <CardContent className="pb-6">
            {sent ? (
              <div className="mt-6 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="text-green-500 w-7 h-7" />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  If <span className="font-semibold text-foreground">{email}</span> is registered, an OTP has been sent. It expires in 10 minutes.
                </p>
                <Link
                  href={`/reset-password?email=${encodeURIComponent(email)}`}
                  className="w-full"
                >
                  <Button className="w-full uppercase tracking-widest font-semibold h-9">
                    Enter OTP & Reset Password
                  </Button>
                </Link>
                <Link href="/login" className="text-xs text-primary hover:underline font-medium flex items-center gap-1.5">
                  <ArrowLeft size={14} /> Back to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-3 mt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4"
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="vendor@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      onBlur={() => {
                        setTouched(true);
                        setEmailError(validate(email));
                      }}
                      className={`pl-9 rounded-sm ${
                        touched && emailError
                          ? "border-red-500 focus-visible:ring-red-500"
                          : touched && !emailError
                          ? "border-green-500 focus-visible:ring-green-500"
                          : ""
                      }`}
                    />
                  </div>
                  {touched && emailError && (
                    <p className="text-xs text-red-500">{emailError}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full uppercase tracking-widest font-semibold h-9 mt-1"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>

                <div className="text-center pt-1">
                  <Link href="/login" className="text-xs text-primary hover:underline font-medium flex items-center justify-center gap-1.5">
                    <ArrowLeft size={14} /> Back to login
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
