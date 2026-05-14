import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, Plus } from "lucide-react";

interface ActionButtonProps extends ButtonProps {
  label: string;
  icon?: LucideIcon;
  variant_type?: "Client" | "Staff" | "Payment" | "Event";
}

export function ActionButton({ label, icon: Icon = Plus, className, ...props }: ActionButtonProps) {
  return (
    <Button
      className={cn(
        "h-8 px-3 gap-1.5 text-[10px] font-bold uppercase tracking-wide shadow-sm",
        className,
      )}
      {...props}
    >
      <Icon size={13} strokeWidth={2.5} /> {label}
    </Button>
  );
}