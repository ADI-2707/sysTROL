import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sysTROL Internal Management Console",
  description: "Enterprise lifecycle, commissioning DAG, and operations portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
