import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "@/components/theme-provider";

import { QueryProvider } from "@/providers/query-provider";
import { BoneyardProvider } from "@/components/boneyard/boneyard-provider";

export const metadata: Metadata = {
  title: "Vendor Portal",

  description: "Vendor Management Portal",
};

import { NavigationLoader } from "@/components/ui/navigation-loader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <BoneyardProvider />
          <QueryProvider>
            <NavigationLoader>
               {children}
            </NavigationLoader>
            <Toaster position="top-right" offset="80px" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
