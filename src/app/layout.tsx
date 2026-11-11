import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import NameHeader from "@/components/layout/NameHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Crystal's Spectra Vault",
    // album pages fill in %s with their name
    template: "%s · Crystal's Spectra Vault",
  },
  description: "...",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
            <NameHeader/>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
