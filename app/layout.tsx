import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mechanical Systems Playground",
  description: "Interactive visualizations of gears, linkages, and pulley systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
