"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AddClientContent } from "../../_components/add-client-content";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useVendorClient } from "@/hooks/use-vendor-clients";

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: client, isLoading, isError } = useVendorClient(id);

  useEffect(() => {
    if (isError) {
      toast.error("Client not found.");
      router.push("/clients");
    }
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <AddClientContent initialData={client} isEdit={true} />
    </div>
  );
}
