import type { Metadata } from "next";
import { Nunito_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";

// Futura alternative - Nunito Sans (geometric sans-serif)
const nunitoSans = Nunito_Sans({
  variable: "--font-futura",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Okomito alternative - Inter (clean secondary font)
const inter = Inter({
  variable: "--font-okomito",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Onbloom",
  description: "Human-first onboarding.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en">
          <body
            className={`${nunitoSans.variable} ${inter.variable} antialiased`}
          >
            {children}
            <Toaster />
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
