'use client';

export function AboutTab() {
  return (
    <div className="animate-in fade-in duration-300">
      <h6 className="text-foreground text-[16px] font-bold uppercase mb-5">Bio Data</h6>
      <p className="text-muted-foreground text-[14px] leading-[2] mb-10">
        Hi I&apos;m Petey Cruiser,has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
      </p>

      <h6 className="text-foreground text-[16px] font-bold uppercase mb-6">Experience</h6>
      <div className="space-y-8">
        <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-primary before:rounded-full">
          <p className="text-primary text-[15px] font-bold hover:underline cursor-pointer">Lead designer / Developer</p>
          <p className="text-muted-foreground text-[13px] mt-1 mb-2">websitename.com</p>
          <p className="text-foreground font-bold text-[12px] uppercase">2010 - 2015</p>
          <p className="text-muted-foreground text-[14px] leading-relaxed mt-4">
            &quot;Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.&quot;
          </p>
        </div>

        <div className="h-px bg-border w-full" />

        <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-gray-300 before:rounded-full">
          <p className="text-primary text-[15px] font-bold hover:underline cursor-pointer">Senior Graphic Designer</p>
          <p className="text-muted-foreground text-[13px] mt-1 mb-2">coderthemes.com</p>
          <p className="text-foreground font-bold text-[12px] uppercase">2007 - 2009</p>
          <p className="text-muted-foreground text-[14px] leading-relaxed mt-4">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.
          </p>
        </div>

        <div className="h-px bg-border w-full" />

        <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-gray-300 before:rounded-full">
          <p className="text-primary text-[15px] font-bold hover:underline cursor-pointer">Graphic Designer</p>
          <p className="text-muted-foreground text-[13px] mt-1 mb-2">softthemes.com</p>
          <p className="text-foreground font-bold text-[12px] uppercase">2005 - 2007</p>
          <p className="text-muted-foreground text-[14px] leading-relaxed mt-4">
            Scrambled it to make a type specimen book. Industry&apos;s standard dummy text ever since the 1500s.
          </p>
        </div>
      </div>
    </div>
  );
}
