"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { usePublicClientLogin } from "@/hooks/use-public-client";
import { toPublicSlug } from "@/lib/utils";
import { validateEmail } from "@/lib/validation";
import { toast } from "sonner";
import Loader from "@/components/ui/loader";

const CLIENT_PORTAL_URL = process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || "http://localhost:3004";

export default function PublicClientLogin({ data }: { data?: any }) {
  const slug = data?.slug || "";
  const colors = data?.colors || {};
  const vendor = data?.vendor || {};
  const publicSlug = slug === "preview" ? toPublicSlug(vendor.company_name || "") : slug;
  const primary = colors.primary_color || "#2563eb";
  const loaderDotColors = [
    colors.primary_color,
    colors.secondary_color,
    colors.header_color,
    colors.footer_color,
    colors.text_color,
    colors.hover_color,
  ];
  const loginMutation = usePublicClientLogin(publicSlug);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateEmail = (value: string) => {
    setEmail(value.toLowerCase());
    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
  };

  const updatePassword = (value: string) => {
    setPassword(value);
    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
  };

  const FieldError = ({ field }: { field: string }) =>
    fieldErrors[field] ? (
      <p className="mt-1 text-xs font-bold text-red-600">{fieldErrors[field]}</p>
    ) : null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setFieldErrors({});

    const emailValue = email.trim().toLowerCase();
    const nextErrors: Record<string, string> = {};
    const emailErr = validateEmail(emailValue);
    if (emailErr) nextErrors.email = emailErr;
    if (!password) nextErrors.password = "Password is required.";

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      toast.error("Please fill all required fields correctly.");
      return;
    }

    try {
      const payload = await loginMutation.mutateAsync({ email: emailValue, password });
      const handoffToken = payload.data?.handoff_token;
      if (!handoffToken) throw new Error("Client portal login handoff is unavailable.");

      setRedirecting(true);
      setMessage("Login successful. Redirecting to your client dashboard...");

      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          window.location.assign(
            `${CLIENT_PORTAL_URL}/api/clients/auth/handoff?token=${encodeURIComponent(handoffToken)}`,
          );
        }, 100);
      }
    } catch (err: any) {
      setRedirecting(false);
      setFieldErrors({ _form: err?.message || "Login failed. Please try again." });
    }
  };

  return (
    <section className="relative w-full bg-gray-50 px-6 py-16 md:px-10">
      {redirecting && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <Loader dotColors={loaderDotColors} label="Opening client dashboard..." />
          <p className="mt-6 max-w-sm px-6 text-center text-sm font-bold text-white">
            Please wait. We are securely taking you to your client portal.
          </p>
        </div>
      )}
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-stretch">
        <form onSubmit={submit} noValidate className="bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ backgroundColor: primary }}>
              <LogIn className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-950">Client Login</h1>
              <p className="text-sm text-gray-700">Use your registered email and password.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-700">Email <span className="text-red-500">*</span></span>
              <input
                type="text"
                inputMode="email"
                autoCapitalize="none"
                disabled={redirecting || loginMutation.isPending}
                value={email}
                onChange={(e) => updateEmail(e.target.value)}
                className={`h-12 w-full border bg-white px-4 text-sm text-gray-950 placeholder:text-gray-500 outline-none focus:border-gray-950 ${fieldErrors.email ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                placeholder="Enter email address"
              />
              <FieldError field="email" />
            </label>
            <label className="block space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-700">Password <span className="text-red-500">*</span></span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  disabled={redirecting || loginMutation.isPending}
                  value={password}
                  onChange={(e) => updatePassword(e.target.value)}
                  className={`h-12 w-full border bg-white px-4 pr-11 text-sm text-gray-950 placeholder:text-gray-500 outline-none focus:border-gray-950 ${fieldErrors.password ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  placeholder="Enter password"
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FieldError field="password" />
            </label>
          </div>

          {message && (
            <div className="mt-5 flex items-center gap-2 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> {message}
            </div>
          )}
          {fieldErrors._form && <p className="mt-5 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{fieldErrors._form}</p>}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button disabled={redirecting || loginMutation.isPending} className="inline-flex h-12 items-center justify-center px-7 text-sm font-black uppercase tracking-widest text-white disabled:opacity-60" style={{ backgroundColor: primary }}>
              {redirecting || loginMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {redirecting ? "Redirecting..." : "Login"}
            </button>
            <Link href={slug === "preview" ? "/preview?previewPage=register" : `/${slug}/register`} className="text-sm font-bold text-gray-700 underline underline-offset-4 hover:text-gray-950">
              New client? Register
            </Link>
          </div>
        </form>

        <aside className="flex flex-col justify-between bg-gray-950 p-8 text-white">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Client Access</span>
            <h2 className="mt-5 text-5xl font-black leading-none">Welcome back.</h2>
            <p className="mt-5 max-w-md text-sm font-medium leading-7 text-white/60">
              Login checks the client record saved under {vendor.company_name || "this vendor"}.
            </p>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-white/35">Current Access</p>
            <p className="mt-2 text-3xl font-black">Email + Password</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
