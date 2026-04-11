"use client";

import { useState, useEffect } from "react";
import {
  useVendorMe,
  useUpdateVendorProfile,
  Vendor,
} from "@/hooks/use-vendors";
import { VendorSidebarProfileCard } from "./vendor-sidebar-profile-card";
import { VendorLocationCard } from "./vendor-location-card";

const cardClass =
  "bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none mb-6";

const inputClass =
  "w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all";

const sectionHeadingClass =
  "text-[#3c4858] text-[13px] font-bold uppercase tracking-wider mb-5 mt-4";

export function VendorEditProfileContent() {
  const { data: vendor, isLoading } = useVendorMe();
  const updateProfile = useUpdateVendorProfile();

  // Email preference UI state (local only — no API field)
  const [pref1, setPref1] = useState(true);
  const [pref2, setPref2] = useState(true);

  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: "",
    email: "",
    company_name: "",
    company_contact: "",
    contact: "",
    company_email: "",
    company_address: "",
    address: "",
    website: "",
    youtube: "",
    facebook: "",
    instagram: "",
    about_us: "",
    profile: "",
    bank_name: "",
    acc_no: "",
    ifsc_code: "",
    acc_type: "" as any,
    branch: "",
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        email: vendor.email || "",
        company_name: vendor.company_name || "",
        company_contact: vendor.company_contact || "",
        contact: vendor.contact || "",
        company_email: vendor.company_email || "",
        company_address: vendor.company_address || "",
        address: vendor.address || "",
        website: vendor.website || "",
        youtube: vendor.youtube || "",
        facebook: vendor.facebook || "",
        instagram: vendor.instagram || "",
        about_us: vendor.about_us || "",
        profile: vendor.profile || "",
        bank_name: vendor.bank_name || "",
        acc_no: vendor.acc_no || "",
        ifsc_code: vendor.ifsc_code || "",
        acc_type: (vendor.acc_type || "") as any,
        branch: vendor.branch || "",
      });
    }
  }, [vendor]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 custom-scrollbar">
      <div className="mx-auto space-y-6">

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* --- LEFT COLUMN --- */}
          <div className="w-full lg:w-[380px] shrink-0 space-y-6">
            <VendorSidebarProfileCard vendor={vendor} isEditMode />
            <VendorLocationCard />
          </div>

          {/* --- RIGHT COLUMN --- Form Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className={`${cardClass} flex-1 flex flex-col mb-0 overflow-hidden`}>
              <div className="flex-1 p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>

                  {/* NAME */}
                  <div>
                    <h6 className={sectionHeadingClass}>NAME</h6>
                    <div className="space-y-[18px]">
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">User Name</label>
                        <div className="md:col-span-3">
                          <input
                            name="name"
                            type="text"
                            value={formData.name || ""}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Enter user name"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">Company Name</label>
                        <div className="md:col-span-3">
                          <input
                            name="company_name"
                            type="text"
                            value={formData.company_name || ""}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Enter company name"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CONTACT INFO */}
                  <div>
                    <h6 className={sectionHeadingClass}>CONTACT INFO</h6>
                    <div className="space-y-[18px]">
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">Mobile Number</label>
                        <div className="md:col-span-3">
                          <input
                            name="company_contact"
                            type="text"
                            value={formData.company_contact || ""}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Enter mobile number"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">Company Email</label>
                        <div className="md:col-span-3">
                          <input
                            name="company_email"
                            type="email"
                            value={formData.company_email || ""}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Enter company email"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1 mt-[9px]">
                          Email <span className="italic text-[13px]">(required)</span>
                        </label>
                        <div className="md:col-span-3">
                          <input
                            name="email"
                            type="email"
                            value={formData.email || ""}
                            readOnly
                            className="w-full px-4 py-[9px] border border-border bg-muted/50 text-muted-foreground rounded-[3px] text-[14px] cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1 mt-[9px]">Address</label>
                        <div className="md:col-span-3">
                          <textarea
                            name="company_address"
                            value={formData.company_address || ""}
                            onChange={handleChange}
                            className={`${inputClass} min-h-[90px] resize-none`}
                            placeholder="Enter address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SOCIAL INFO */}
                  <div>
                    <h6 className={sectionHeadingClass}>SOCIAL INFO</h6>
                    <div className="space-y-[18px]">
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">Website</label>
                        <div className="md:col-span-3">
                          <input
                            name="website"
                            type="text"
                            value={formData.website || ""}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Enter website"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">Youtube</label>
                        <div className="md:col-span-3">
                          <input
                            name="youtube"
                            type="text"
                            value={formData.youtube || ""}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Enter youtube link"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">Facebook</label>
                        <div className="md:col-span-3">
                          <input
                            name="facebook"
                            type="text"
                            value={formData.facebook || ""}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Enter facebook link"
                          />
                        </div>
                      </div>
                      {/* Twitter & LinkedIn — UI display only (no API field) */}
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">Twitter</label>
                        <div className="md:col-span-3">
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="Enter twitter link"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">LinkedIn</label>
                        <div className="md:col-span-3">
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="Enter linkedin link"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">Instagram</label>
                        <div className="md:col-span-3">
                          <input
                            name="instagram"
                            type="text"
                            value={formData.instagram || ""}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Enter instagram link"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ABOUT YOURSELF */}
                  <div>
                    <h6 className={sectionHeadingClass}>ABOUT YOURSELF</h6>
                    <div className="space-y-[18px]">
                      <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-4">
                        <label className="text-[14px] text-[#3c4858] font-normal md:col-span-1 mt-[9px]">Biographical Info</label>
                        <div className="md:col-span-3">
                          <textarea
                            name="about_us"
                            value={formData.about_us || ""}
                            onChange={handleChange}
                            className={`${inputClass} min-h-[100px] resize-none`}
                            placeholder="Enter biographical info"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BANK INFORMATION */}
                  <div>
                    <h6 className={sectionHeadingClass}>BANK INFORMATION</h6>
                    <div className="space-y-[18px]">
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">Bank Name</label>
                        <div className="md:col-span-3">
                          <input
                            name="bank_name"
                            type="text"
                            value={formData.bank_name || ""}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Bank Name"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">Account Number</label>
                        <div className="md:col-span-3">
                          <input
                            name="acc_no"
                            type="text"
                            value={formData.acc_no || ""}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Account Number"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">IFSC Code</label>
                        <div className="md:col-span-3">
                          <input
                            name="ifsc_code"
                            type="text"
                            value={formData.ifsc_code || ""}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="IFSC Code"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">Account Type</label>
                        <div className="md:col-span-3">
                          <select
                            name="acc_type"
                            value={formData.acc_type || ""}
                            onChange={handleChange}
                            className={inputClass}
                          >
                            <option value="">Select Account Type</option>
                            <option value="savings">Savings</option>
                            <option value="current">Current</option>
                            <option value="overdraft">Overdraft</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-normal md:col-span-1">Branch</label>
                        <div className="md:col-span-3">
                          <input
                            name="branch"
                            type="text"
                            value={formData.branch || ""}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Branch Name"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EMAIL PREFERENCES */}
                  <div>
                    <h6 className={sectionHeadingClass}>EMAIL PREFERENCES</h6>
                    <div className="space-y-[18px]">
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-[#3c4858] font-normal md:col-span-1">Verified User</label>
                        <div className="md:col-span-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                          <div
                            className="flex items-center gap-2 cursor-pointer group select-none"
                            onClick={() => setPref1(!pref1)}
                          >
                            <input
                              type="checkbox"
                              checked={pref1}
                              readOnly
                              className="w-4 h-4 rounded-[4px] border-gray-300 accent-primary cursor-pointer"
                            />
                            <span className="text-[14px] text-muted-foreground whitespace-nowrap">
                              Accept to receive post or page notification emails
                            </span>
                          </div>
                          <div
                            className="flex items-center gap-2 cursor-pointer group select-none"
                            onClick={() => setPref2(!pref2)}
                          >
                            <input
                              type="checkbox"
                              checked={pref2}
                              readOnly
                              className="w-4 h-4 rounded-[4px] border-gray-300 accent-primary cursor-pointer"
                            />
                            <span className="text-[14px] text-muted-foreground whitespace-nowrap">
                              Accept to receive email sent to multiple recipients
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={updateProfile.isPending}
                      className="bg-primary text-white px-[20px] py-[10px] text-[13px] font-medium rounded-[5px] hover:bg-primary/90 transition-all disabled:opacity-70"
                    >
                      {updateProfile.isPending ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
