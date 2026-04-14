"use client";

import React, { useState } from "react";
import { 
  ArrowLeft,
  Calendar,
  Hash,
  FileText,
  User,
  Percent,
  TrendingDown,
  Building,
  CheckCircle2,
  CreditCard,
  Check,
  Receipt
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FormGroup } from "@/components/common/FormGroup";
import { CommonCard } from "@/components/common/CommonCard";
import { PersistenceActions } from "@/components/common/PersistenceActions";

interface AddPaymentContentProps {
  isView?: boolean;
}

export default function AddPaymentContent({ isView = false }: AddPaymentContentProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    eventId: "",
    clientId: "",
    clientName: "",
    paymentType: "Online" as "Online" | "Offline",
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: "",
    status: "Pending" as "Paid" | "Pending" | "Unpaid",
    paidAmount: 0,
    vendorDiscount: 0,
    referralDiscount: 0,
    taxGst: 0,
    subscriptionAmount: 0,
    notes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isView) return;

    const newErrors: Record<string, string> = {};
    if (!formData.eventId) newErrors.eventId = "Event ID is required";
    if (!formData.clientId) newErrors.clientId = "Client ID is required";
    if (!formData.clientName) newErrors.clientName = "Client Name is required";
    if (!formData.transactionId) newErrors.transactionId = "Transaction ID is required";
    if (formData.subscriptionAmount <= 0) newErrors.subscriptionAmount = "Amount must be greater than 0";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all required fields correctly.");
      return;
    }

    // Save to localStorage
    const savedData = localStorage.getItem("payments_data");
    const payments = savedData ? JSON.parse(savedData) : [];
    const newPayment = {
      ...formData,
      id: Date.now().toString(),
    };
    
    payments.unshift(newPayment);
    localStorage.setItem("payments_data", JSON.stringify(payments));
    
    toast.success("Payment record saved successfully!");
    router.push("/payment-management");
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-4 sm:px-6 lg:px-8 pt-2 pb-10 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/payment-management" className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-blue-500 hover:border-blue-100 transition-all shadow-sm bg-white dark:bg-gray-900">
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight flex items-center gap-2">
                Save Payment
                <Badge variant="outline" className="text-[10px] font-black border-blue-200 text-blue-600 bg-blue-50/50 px-2.5 py-0.5 ml-1">
                  FINANCIAL ENTRY
                </Badge>
              </h1>
            </div>
            <p className="text-sm text-gray-400 mt-1 italic tracking-tight font-medium leading-relaxed">Generate a new transaction record and manage financial flow for event orders.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 pb-20">
          {/* Main Column */}
          <div className="flex-[2] space-y-6">
            <CommonCard 
              title="Record Identification" 
              subtitle="Basic order and client information" 
              icon={FileText}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormGroup label="Order Id" icon={Hash}>
                  <Input 
                    value={formData.orderId}
                    readOnly
                    className="h-12 pl-12 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl transition-all text-sm font-black text-gray-500 cursor-default" 
                  />
                </FormGroup>

                <FormGroup label="Event Id" icon={Building} error={errors.eventId} required>
                  <Input 
                    value={formData.eventId}
                    onChange={(e) => {
                      setFormData({...formData, eventId: e.target.value.toUpperCase()});
                      if (errors.eventId) setErrors(prev => ({ ...prev, eventId: "" }));
                    }}
                    placeholder="Enter event ID" 
                    className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm font-bold ${errors.eventId ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`} 
                  />
                </FormGroup>

                <FormGroup label="Client Id" icon={Hash} error={errors.clientId} required>
                  <Input 
                    value={formData.clientId}
                    onChange={(e) => {
                      setFormData({...formData, clientId: e.target.value.toUpperCase()});
                      if (errors.clientId) setErrors(prev => ({ ...prev, clientId: "" }));
                    }}
                    placeholder="Enter client ID" 
                    className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm font-bold ${errors.clientId ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`} 
                  />
                </FormGroup>

                <FormGroup label="Client Name" icon={User} error={errors.clientName} required>
                  <Input 
                    value={formData.clientName}
                    onChange={(e) => {
                      setFormData({...formData, clientName: e.target.value});
                      if (errors.clientName) setErrors(prev => ({ ...prev, clientName: "" }));
                    }}
                    placeholder="Enter client name" 
                    className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm font-bold ${errors.clientName ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`} 
                  />
                </FormGroup>
              </div>
            </CommonCard>

            <CommonCard 
              title="Transaction Details" 
              subtitle="Method, timing and processing" 
              icon={Receipt}
              iconColorClass="text-emerald-600"
              iconBgClass="bg-emerald-50 dark:bg-emerald-600/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormGroup label="Payment type (Online/Offline)">
                  <Select 
                    value={formData.paymentType} 
                    onValueChange={(val: "Online" | "Offline") => setFormData({...formData, paymentType: val})}
                  >
                    <SelectTrigger className="h-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl focus:ring-0 transition-all font-bold text-sm">
                      <div className="flex items-center gap-2">
                        <CreditCard size={18} className="text-gray-300" />
                        <SelectValue placeholder="Select Payment Type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-gray-100 text-sm font-bold">
                      <SelectItem value="Online" className="rounded-xl">Online Payment</SelectItem>
                      <SelectItem value="Offline" className="rounded-xl">Offline Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </FormGroup>

                <FormGroup label="Payment Date" icon={Calendar}>
                  <Input 
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                    className="h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm font-bold focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 shadow-sm" 
                  />
                </FormGroup>

                <FormGroup label="Transaction Id" icon={Hash} error={errors.transactionId} required>
                  <Input 
                    value={formData.transactionId}
                    onChange={(e) => {
                      setFormData({...formData, transactionId: e.target.value});
                      if (errors.transactionId) setErrors(prev => ({ ...prev, transactionId: "" }));
                    }}
                    placeholder="Enter transaction ID" 
                    className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm font-bold ${errors.transactionId ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`} 
                  />
                </FormGroup>

                <FormGroup label="Payment Status (Unpaid, Pending, Paid)">
                  <Select 
                    value={formData.status} 
                    onValueChange={(val: "Paid" | "Pending" | "Unpaid") => setFormData({...formData, status: val})}
                  >
                    <SelectTrigger className="h-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl focus:ring-0 transition-all font-black text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${formData.status === "Paid" ? "bg-emerald-500" : formData.status === "Pending" ? "bg-amber-500" : "bg-rose-500"}`} />
                        <SelectValue placeholder="Select Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-gray-100 font-black text-xs uppercase tracking-widest">
                      <SelectItem value="Paid" className="rounded-xl text-emerald-600">Paid Record</SelectItem>
                      <SelectItem value="Pending" className="rounded-xl text-amber-600">Pending Process</SelectItem>
                      <SelectItem value="Unpaid" className="rounded-xl text-rose-600">Unpaid Entry</SelectItem>
                    </SelectContent>
                  </Select>
                </FormGroup>
              </div>
            </CommonCard>

            <CommonCard 
              title="Financial Breakdown" 
              subtitle="Amounts, Deductions and Taxes" 
              icon={TrendingDown}
              iconColorClass="text-orange-600"
              iconBgClass="bg-orange-50 dark:bg-orange-600/10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                <FormGroup label="Paid Amount">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-sm">₹</span>
                    <Input 
                      type="number"
                      value={formData.paidAmount}
                      onChange={(e) => setFormData({...formData, paidAmount: Number(e.target.value)})}
                      className="h-12 pl-8 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm font-black text-emerald-600 focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 shadow-sm" 
                    />
                  </div>
                </FormGroup>

                <FormGroup label="Vendor Discount">
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <Input 
                      type="number"
                      value={formData.vendorDiscount}
                      onChange={(e) => setFormData({...formData, vendorDiscount: Number(e.target.value)})}
                      className="h-12 pl-10 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm font-bold text-gray-600 shadow-sm" 
                    />
                  </div>
                </FormGroup>

                <FormGroup label="Referral Discount">
                  <div className="relative">
                    <TrendingDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <Input 
                      type="number"
                      value={formData.referralDiscount}
                      onChange={(e) => setFormData({...formData, referralDiscount: Number(e.target.value)})}
                      className="h-12 pl-10 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm font-bold text-gray-600 shadow-sm" 
                    />
                  </div>
                </FormGroup>

                <FormGroup label="Tax (GST)">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 font-extrabold text-sm">₹</span>
                    <Input 
                      type="number"
                      value={formData.taxGst}
                      onChange={(e) => setFormData({...formData, taxGst: Number(e.target.value)})}
                      className="h-12 pl-8 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm font-black text-rose-500 shadow-sm" 
                    />
                  </div>
                </FormGroup>
              </div>

              <div className="mt-8 space-y-4 group">
                <FormGroup label="Subscription Amount" error={errors.subscriptionAmount} required>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 font-black text-2xl">₹</span>
                    <Input 
                      type="number"
                      value={formData.subscriptionAmount}
                      onChange={(e) => {
                        setFormData({...formData, subscriptionAmount: Number(e.target.value)});
                        if (errors.subscriptionAmount) setErrors(prev => ({ ...prev, subscriptionAmount: "" }));
                      }}
                      placeholder="0.00"
                      className={`h-20 pl-14 border-gray-100 dark:border-gray-800 bg-blue-50/20 dark:bg-blue-900/10 rounded-2xl transition-all text-3xl font-black text-blue-700 ${errors.subscriptionAmount ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 shadow-lg shadow-blue-500/5"}`} 
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                      <Badge className="bg-blue-600 text-white border-none py-1.5 px-4 font-black text-[10px] uppercase tracking-widest rounded-lg">Net Total Amount</Badge>
                    </div>
                  </div>
                </FormGroup>
                <p className="text-[11px] font-bold text-gray-400 italic mt-1 ml-1 flex items-center gap-2">
                  <Check size={14} className="text-blue-500" />
                  The primary subscription or event fee before any internal processing.
                </p>
              </div>
            </CommonCard>

            <CommonCard title="Notes" subtitle="Internal remarks or payment details" icon={FileText} className="mt-8">
              <FormGroup label="Remarks" icon={FileText} iconTop>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter remarks or description" 
                  className="w-full pl-12 pr-4 py-3 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl outline-none transition-all text-sm min-h-[120px] resize-none focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 shadow-sm" 
                />
              </FormGroup>
            </CommonCard>
          </div>

          {/* Action Sidebar */}
          <div className="flex-1 space-y-6 lg:sticky lg:top-8">
            {/* Standard Action Card */}
            <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <PersistenceActions 
                onSave={handleSubmit}
                onCancel={() => router.push("/payment-management")}
                saveLabel="SAVE PAYMENT"
              />
            </div>

            <CommonCard 
              title="Summary" 
              subtitle="Finalize the payment record" 
              icon={CheckCircle2}
              iconColorClass="text-emerald-600"
              iconBgClass="bg-emerald-50 dark:bg-emerald-500/10"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-800/50">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Entry Date</span>
                  <span className="text-[13px] font-bold text-gray-800 dark:text-gray-100">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Payment Type</span>
                  <span className="text-[13px] font-bold text-blue-600 uppercase tracking-tight">{formData.paymentType}</span>
                </div>
              </div>
            </CommonCard>

            <div className="bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-50 dark:border-gray-800">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Creation Date</span>
                  <span className="text-[12px] font-bold text-gray-800 dark:text-gray-100">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Processing Time</span>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase px-2 py-0.5">Instant</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
