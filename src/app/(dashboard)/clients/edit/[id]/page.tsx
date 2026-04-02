"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AddClientContent } from "../../_components/add-client-content";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id;
    if (!id) {
        router.push("/clients");
        return;
    }

    const savedData = localStorage.getItem("clients_data");
    if (savedData) {
      const clients = JSON.parse(savedData);
      const foundClient = clients.find((c: any) => c.id.toString() === id.toString());
      if (foundClient) {
        setClient(foundClient);
      } else {
        toast.error("Client not found.");
        router.push("/clients");
      }
    } else {
        router.push("/clients");
    }
    setLoading(false);
  }, [params.id, router]);

  if (loading) {
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
