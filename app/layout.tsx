import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weiting Liu",
  description: "Personal page of Weiting Liu — Staff SRE at Indeed, based in Tokyo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
