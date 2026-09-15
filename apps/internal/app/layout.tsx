import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { TopProgressBar } from "./top-progress-bar";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <TopProgressBar />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
