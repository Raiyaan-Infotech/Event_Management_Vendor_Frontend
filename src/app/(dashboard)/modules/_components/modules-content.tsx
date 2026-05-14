"use client";

import React from "react";
import { Layers, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { useVendorModules } from "@/hooks/use-vendor-roles";

export default function ModulesContent() {
  const { data: modules, isLoading } = useVendorModules();

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Modules"
        subtitle="System modules and their permissions (read-only)"
        total={modules?.length}
      />

      {isLoading ? (
        <div className="text-center py-12 text-sm text-[var(--vendor-text-muted)]">Loading modules...</div>
      ) : !modules || modules.length === 0 ? (
        <div className="text-center py-12">
          <Layers className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm text-[var(--vendor-text-muted)]">No modules found. Run the seeder to create modules.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="bg-[var(--vendor-panel-bg)] rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[var(--vendor-radius-control)] bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                  <Layers size={18} className="text-[var(--vendor-primary-btn)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--vendor-text)]">{mod.name}</h3>
                  <p className="text-[11px] text-[var(--vendor-text-muted)]">{mod.slug}</p>
                </div>
              </div>

              {mod.description && (
                <p className="text-xs text-[var(--vendor-text-muted)] mb-4">{mod.description}</p>
              )}

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[var(--vendor-text-muted)] uppercase tracking-wide">Permissions</p>
                <div className="flex flex-wrap gap-1.5">
                  {mod.permissions.length > 0 ? (
                    mod.permissions.map((perm) => {
                      const action = perm.slug.split(".").pop() || perm.name;
                      return (
                        <Badge
                          key={perm.id}
                          variant="outline"
                          className="text-[10px] font-semibold capitalize border-[var(--vendor-border)] dark:border-gray-700 text-gray-600 dark:text-[var(--vendor-text-muted)]"
                        >
                          <Lock size={8} className="mr-1" />
                          {action}
                        </Badge>
                      );
                    })
                  ) : (
                    <span className="text-xs text-[var(--vendor-text-muted)]">No permissions</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
