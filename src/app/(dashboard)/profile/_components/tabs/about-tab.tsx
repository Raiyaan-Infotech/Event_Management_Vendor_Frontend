'use client';

import { useVendorMe } from '@/hooks/use-vendors';

export function AboutTab() {
  const { data: vendor } = useVendorMe();
  
  return (
    <div className="animate-in fade-in duration-300">
      <h6 className="text-foreground text-[16px] font-bold uppercase mb-5">About</h6>
      {vendor?.about_us ? (
        <p className="text-muted-foreground text-[14px] leading-[2] mb-10">
          {vendor.about_us}
        </p>
      ) : (
        <p className="text-muted-foreground text-[14px] leading-[2] mb-10 italic">
          No description provided yet.
        </p>
      )}

    </div>
  );
}
