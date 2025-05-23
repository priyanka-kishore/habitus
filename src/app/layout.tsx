import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// This metadata object is used by Next.js to set the <title> and <meta> description tags for your application.
// It is automatically picked up by Next.js when exported from the root layout file (src/app/layout.tsx).
export const metadata: Metadata = {
  title: "Habitus | Do habits together", // Tab title
  description: "Cultivate strong habits in a community of like-minded people", // Meta description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
