import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Vistoria",
  description:
    "Vistoria is a dark, futuristic AI studio for crafting and transforming visuals with precision and style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#6366F1" },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "font-body antialiased bg-background text-foreground",
            headingFont.variable,
            bodyFont.variable
          )}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
