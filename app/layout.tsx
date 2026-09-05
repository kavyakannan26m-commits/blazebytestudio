import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BlazeByte Studio",
    template: "%s | BlazeByte Studio",
  },
  description:
    "Practical technology learning designed to help students build useful skills, gain confidence, and prepare for their future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0B0F19] text-slate-50 antialiased">{children}</body>
    </html>
  );
}