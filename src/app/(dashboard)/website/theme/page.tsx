import { VendorThemeContent } from './_components/vendor-theme-content';

export const metadata = {
    title: 'Website Theme',
    description: 'View the theme assigned to your current subscription plan',
};

export default function VendorThemePage() {
    return (
        <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 pt-4 pb-10 custom-scrollbar">
            <div className="space-y-6 max-w-[1700px] mx-auto">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Website Theme</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Your website's appearance, colors, and layout structure are determined by your active subscription plan.
                    </p>
                </div>
                <VendorThemeContent />
            </div>
        </div>
    );
}
