import HomeSettingBuilder from "./_components/home-setting-builder";

export const metadata = {
  title: "Home Setting — Vendor Portal",
  description: "Drag-and-drop builder for your public home page layout",
};

export default function HomeSettingPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Home Setting</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose which sections appear on your public home page and arrange their
          order. Changes take effect after you save.
        </p>
      </div>

      {/* Builder */}
      <HomeSettingBuilder />
    </div>
  );
}
