"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { usePublicClientRegister } from "@/hooks/use-public-client";
import { toPublicSlug } from "@/lib/utils";

export default function PublicClientRegister({ data }: { data?: any }) {
  const slug = data?.slug || "";
  const colors = data?.colors || {};
  const vendor = data?.vendor || {};
  const publicSlug = slug === "preview" ? toPublicSlug(vendor.company_name || "") : slug;
  const primary = colors.primary_color || "#2563eb";
  const registerMutation = usePublicClientRegister(publicSlug);

  const initialForm = { name: "", email: "", mobile: "", password: "", confirm_password: "" };
  const [form, setForm] = useState({ ...initialForm });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const setOneError = (key: string, msg: string) => {
    setFieldErrors({ [key]: msg });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setFieldErrors({});

    // Validate one field at a time — stop on first error
    if (!form.name.trim())   { setOneError("name",  "Full name is required."); return; }
    if (!form.mobile.trim()) { setOneError("mobile","Mobile number is required."); return; }

    const emailRegex = /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/;
    if (!form.email.trim())                        { setOneError("email", "Email is required."); return; }
    if (!emailRegex.test(form.email.trim()))        { setOneError("email", "Enter a valid email address."); return; }

    const pw = form.password;
    if (!pw.trim())                   { setOneError("password", "Password is required."); return; }
    if (/\s/.test(pw))                { setOneError("password", "Password must not contain spaces."); return; }
    if (pw.length < 8)                { setOneError("password", "Password must be at least 8 characters."); return; }
    if (!/[A-Z]/.test(pw))           { setOneError("password", "Password must include at least 1 uppercase letter."); return; }
    if (!/[a-z]/.test(pw))           { setOneError("password", "Password must include at least 1 lowercase letter."); return; }
    if (!/[0-9]/.test(pw))           { setOneError("password", "Password must include at least 1 number."); return; }
    if (!/[^A-Za-z0-9]/.test(pw))   { setOneError("password", "Password must include at least 1 special character."); return; }
    if (!form.confirm_password.trim()) { setOneError("confirm_password", "Please confirm your password."); return; }
    if (pw !== form.confirm_password)  { setOneError("confirm_password", "Passwords do not match."); return; }

    const { confirm_password, ...payload } = form;

    try {
      await registerMutation.mutateAsync({
        ...payload,
        name: payload.name.trim(),
        mobile: payload.mobile.trim(),
        email: payload.email.trim(),
        address: null, country: null, state: null, district: null,
        city: null, locality: null, pincode: null,
        subscribe_newsletter: true,
      });
      setMessage("Registration completed. Your details are now added with this vendor.");
      setForm({ ...initialForm });
    } catch (err: any) {
      const msg: string = err?.message || "Registration failed. Please try again.";
      if (msg.toLowerCase().includes("email")) {
        setOneError("email", "This email is already registered.");
      } else {
        setFieldErrors({ _form: msg });
      }
    }
  };

  const FieldError = ({ field }: { field: string }) =>
    fieldErrors[field] ? (
      <p className="mt-1 text-xs font-bold text-red-600">{fieldErrors[field]}</p>
    ) : null;

  return (
    <section className="w-full bg-gray-50 px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <aside className="flex flex-col justify-between bg-gray-950 p-8 text-white">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primary }}>Client Register</span>
            <h1 className="mt-5 text-5xl font-black leading-none">Create your client profile.</h1>
            <p className="mt-5 max-w-md text-sm font-medium leading-7 text-white/60">
              Register with {vendor.company_name || "this vendor"} so the team can manage your event details from the client module.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
            <div>
              <p className="text-3xl font-black">01</p>
              <p className="text-xs font-bold uppercase tracking-widest text-white/35">Profile</p>
            </div>
            <div>
              <p className="text-3xl font-black">Live</p>
              <p className="text-xs font-bold uppercase tracking-widest text-white/35">Vendor Client</p>
            </div>
          </div>
        </aside>

        <form onSubmit={submit} noValidate className="bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ backgroundColor: primary }}>
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-950">Register</h2>
              <p className="text-sm text-gray-500">Only the core client details are required here.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Full Name */}
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name <span className="text-red-500">*</span></span>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Enter full name"
                className={`h-12 w-full border px-4 text-sm outline-none focus:border-gray-950 ${fieldErrors.name ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              <FieldError field="name" />
            </label>

            {/* Email */}
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Email <span className="text-red-500">*</span></span>
              <input
                type="text"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Enter email address"
                className={`h-12 w-full border px-4 text-sm outline-none focus:border-gray-950 ${fieldErrors.email ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              <FieldError field="email" />
            </label>

            {/* Mobile */}
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Mobile <span className="text-red-500">*</span></span>
              <input
                type="text"
                value={form.mobile}
                onChange={(e) => update("mobile", e.target.value)}
                placeholder="Enter mobile number"
                className={`h-12 w-full border px-4 text-sm outline-none focus:border-gray-950 ${fieldErrors.mobile ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              <FieldError field="mobile" />
            </label>

            {/* Password */}
            <label className="space-y-2 relative">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Password <span className="text-red-500">*</span></span>
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Enter password"
                className={`h-12 w-full border px-4 pr-10 text-sm outline-none focus:border-gray-950 ${fieldErrors.password ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-700">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <FieldError field="password" />
            </label>

            {/* Confirm Password */}
            <label className="space-y-2 relative">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Confirm Password <span className="text-red-500">*</span></span>
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirm_password}
                onChange={(e) => update("confirm_password", e.target.value)}
                placeholder="Confirm password"
                className={`h-12 w-full border px-4 pr-10 text-sm outline-none focus:border-gray-950 ${fieldErrors.confirm_password ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-700">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <FieldError field="confirm_password" />
            </label>
          </div>

          {message && (
            <div className="mt-5 flex items-center gap-2 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> {message}
            </div>
          )}
          {fieldErrors._form && (
            <p className="mt-5 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{fieldErrors._form}</p>
          )}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              disabled={registerMutation.isPending}
              className="inline-flex h-12 items-center justify-center px-7 text-sm font-black uppercase tracking-widest text-white disabled:opacity-60"
              style={{ backgroundColor: primary }}
            >
              {registerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Register
            </button>
            <Link href={slug === "preview" ? "/preview?previewPage=login" : `/${slug}/login`} className="text-sm font-bold text-gray-500 hover:text-gray-950">
              Already registered? Login
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
