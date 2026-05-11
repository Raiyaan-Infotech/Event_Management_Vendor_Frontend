"use client";

import React, { useState, useEffect } from "react";
import { Flag, Globe, Building, ChevronRight } from "lucide-react";
import { FormGroup } from "@/components/common/FormGroup";
import {
  useCountries,
  useStates,
  useDistricts,
  useCities,
  type LocationItem,
} from "@/hooks/use-locations";

export interface LocationValues {
  country: string;
  state: string;
  district: string;
  city: string;
}

// ─── Single Searchable Select ─────────────────────────────────────────────────
function LocationSelect({
  value,
  onValueChange,
  options,
  placeholder,
  icon: Icon,
  disabled = false,
  isLoading = false,
  isView = false,
}: {
  value: string;
  onValueChange: (name: string) => void;
  options: LocationItem[];
  placeholder: string;
  icon: React.ElementType;
  disabled?: boolean;
  isLoading?: boolean;
  isView?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isView) {
    return (
      <div className="h-10 px-4 flex items-center text-[13px] font-black text-gray-800 dark:text-gray-100">
        {value || "—"}
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="relative">
        <Icon
          size={16}
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-colors pointer-events-none
            ${disabled ? "text-gray-200" : "text-gray-300 group-focus-within:text-blue-500"}`}
        />
        <input
          value={open ? search : value || ""}
          onChange={(e) => {
            if (disabled) return;
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            if (disabled) return;
            setOpen(true);
            setSearch("");
          }}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          readOnly={disabled}
          placeholder={isLoading ? "Loading…" : placeholder}
          className={`h-10 w-full pl-9 pr-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-xl text-[13px] shadow-sm outline-none transition-all
            focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5
            ${disabled ? "opacity-60 cursor-default" : ""}
            ${!disabled && value ? "font-medium" : ""}`}
        />
        <ChevronRight
          size={13}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 transition-transform duration-200 pointer-events-none
            ${open ? "rotate-90" : ""}`}
        />
      </div>

      {open && !disabled && (
        <div className="absolute z-50 w-full mt-2 py-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xl max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          <button
            type="button"
            onMouseDown={() => { onValueChange(""); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-[12px] text-gray-400 italic hover:bg-rose-50 dark:hover:bg-rose-500/10 border-b border-gray-50 dark:border-gray-800/50"
          >
            {placeholder}
          </button>

          {isLoading ? (
            <div className="px-4 py-3 text-[12px] text-gray-400 text-center italic">Loading…</div>
          ) : filtered.length > 0 ? (
            filtered.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onMouseDown={() => { onValueChange(opt.name); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-[13px] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors
                  ${value === opt.name ? "text-blue-600 font-bold bg-blue-50/50" : "text-gray-600 dark:text-gray-300"}`}
              >
                {opt.name}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-[12px] text-gray-400 italic">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── LocationSelects (Country → State → District → City) ─────────────────────
export function LocationSelects({
  values,
  onChange,
  isView = false,
}: {
  values: LocationValues;
  onChange: (values: LocationValues) => void;
  isView?: boolean;
}) {
  const [countryId,  setCountryId]  = useState<number | null>(null);
  const [stateId,    setStateId]    = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);

  const { data: countries = [], isLoading: loadingCountries  } = useCountries();
  const { data: states    = [], isLoading: loadingStates      } = useStates(countryId);
  const { data: districts = [], isLoading: loadingDistricts   } = useDistricts(stateId);
  const { data: cities    = [], isLoading: loadingCities      } = useCities(districtId);

  // Resolve IDs from saved names when data loads (pre-fill on edit)
  useEffect(() => {
    if (!countries.length || !values.country) return;
    const found = countries.find((c) => c.name === values.country);
    setCountryId(found?.id ?? null);
  }, [countries, values.country]);

  useEffect(() => {
    if (!states.length || !values.state) return;
    const found = states.find((s) => s.name === values.state);
    setStateId(found?.id ?? null);
  }, [states, values.state]);

  useEffect(() => {
    if (!districts.length || !values.district) return;
    const found = districts.find((d) => d.name === values.district);
    setDistrictId(found?.id ?? null);
  }, [districts, values.district]);

  const handleCountry = (name: string) => {
    const found = countries.find((c) => c.name === name);
    setCountryId(found?.id ?? null);
    setStateId(null);
    setDistrictId(null);
    onChange({ country: name, state: "", district: "", city: "" });
  };

  const handleState = (name: string) => {
    const found = states.find((s) => s.name === name);
    setStateId(found?.id ?? null);
    setDistrictId(null);
    onChange({ ...values, state: name, district: "", city: "" });
  };

  const handleDistrict = (name: string) => {
    const found = districts.find((d) => d.name === name);
    setDistrictId(found?.id ?? null);
    onChange({ ...values, district: name, city: "" });
  };

  const handleCity = (name: string) => {
    onChange({ ...values, city: name });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <FormGroup label="Country" required={!isView} isView={isView}>
        <LocationSelect value={values.country} onValueChange={handleCountry}
          options={countries} placeholder="Select Country" icon={Flag}
          isLoading={loadingCountries} isView={isView} />
      </FormGroup>

      <FormGroup label="State" required={!isView} isView={isView}>
        <LocationSelect value={values.state} onValueChange={handleState}
          options={states} placeholder={values.country ? "Select State" : "Select Country First"}
          icon={Globe} disabled={!countryId} isLoading={loadingStates} isView={isView} />
      </FormGroup>

      <FormGroup label="District" required={!isView} isView={isView}>
        <LocationSelect value={values.district} onValueChange={handleDistrict}
          options={districts} placeholder={values.state ? "Select District" : "Select State First"}
          icon={Building} disabled={!stateId} isLoading={loadingDistricts} isView={isView} />
      </FormGroup>

      <FormGroup label="City" required={!isView} isView={isView}>
        <LocationSelect value={values.city} onValueChange={handleCity}
          options={cities} placeholder={values.district ? "Select City" : "Select District First"}
          icon={Building} disabled={!districtId} isLoading={loadingCities} isView={isView} />
      </FormGroup>
    </div>
  );
}
