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
        <div className="text-center py-12 text-sm text-gray-400">Loading modules...</div>
      ) : !modules || modules.length === 0 ? (
        <div className="text-center py-12">
          <Layers className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">No modules found. Run the seeder to create modules.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                  <Layers size={18} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">{mod.name}</h3>
                  <p className="text-[11px] text-gray-400">{mod.slug}</p>
                </div>
              </div>

              {mod.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{mod.description}</p>
              )}

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Permissions</p>
                <div className="flex flex-wrap gap-1.5">
                  {mod.permissions.length > 0 ? (
                    mod.permissions.map((perm) => {
                      const action = perm.slug.split(".").pop() || perm.name;
                      return (
                        <Badge
                          key={perm.id}
                          variant="outline"
                          className="text-[10px] font-semibold capitalize border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                        >
                          <Lock size={8} className="mr-1" />
                          {action}
                        </Badge>
                      );
                    })
                  ) : (
                    <span className="text-xs text-gray-400">No permissions</span>
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
