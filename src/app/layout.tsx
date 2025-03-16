import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./qrcode.css"; // Add separate CSS file for QR code styles
import LayoutQRCode from "@/components/LayoutQRCode"; // Import client component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define Mono Lisa as a local font
const monoLisa = localFont({
  src: "../fonts/MonoLisa-Regular.ttf",
  variable: "--font-mono-lisa",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Historical Computing Images Slideshow",
  description: "A slideshow of historical computing images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${monoLisa.variable}`}
        style={{ fontFamily: "var(--font-mono-lisa)" }}
      >
        {/* QR Code rendered once in the layout - never re-renders */}
        <LayoutQRCode />
        {children}
      </body>
    </html>
  );
}
