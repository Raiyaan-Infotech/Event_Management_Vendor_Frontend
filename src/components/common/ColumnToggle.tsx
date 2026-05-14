import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface ColumnToggleProps {
  columns: { key: string; label: string }[];
  tempColumns: string[];
  onToggleAll: () => void;
  onToggle: (key: string) => void;
  onSave: () => void;
}

export function ColumnToggle({ 
  columns, 
  tempColumns, 
  onToggleAll, 
  onToggle, 
  onSave 
}: ColumnToggleProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-gray-50 pb-3">
        <span className="text-[var(--vendor-form-label-text)] font-semibold uppercase text-[var(--vendor-text-muted)] tracking-wide">Select Columns</span>
        <Button 
          variant="ghost" 
          onClick={onToggleAll}
          className="h-7 px-2 text-[9px] font-black uppercase tracking-wide text-[var(--vendor-primary-btn)] hover:bg-blue-50"
        >
          {tempColumns.length === columns.length ? "Deselect All" : "Select All"}
        </Button>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto px-1 space-y-1 py-1">
        {columns.map((col) => (
          <div 
            key={col.key} 
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-[var(--vendor-radius-control)] cursor-pointer transition-all ${tempColumns.includes(col.key) ? 'bg-blue-50/50 text-blue-700' : 'hover:bg-gray-50 text-gray-600'}`}
            onClick={() => onToggle(col.key)}
          >
            <Checkbox 
              checked={tempColumns.includes(col.key)} 
              onCheckedChange={() => {}}
              className="border-gray-300 data-[state=checked]:bg-[var(--vendor-primary-btn)] data-[state=checked]:border-blue-600 pointer-events-none"
            />
            <span className="text-[12px] font-black uppercase tracking-tight cursor-pointer flex-1">
              {col.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-50 p-1">
        <Button 
          onClick={onSave}
          className="w-full h-8 bg-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn-hover)] text-white text-[var(--vendor-control-text)] font-semibold uppercase tracking-wide rounded-[var(--vendor-radius-control)] shadow-sm active:scale-95 transition-all"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
