import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { TopProgressBar } from "./top-progress-bar";
import { AuthProvider } from "../lib/auth-context";

export const metadata: Metadata = {
  title: "sysTROL Internal Management Console",
  description: "Enterprise lifecycle, commissioning DAG, and operations portal",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
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
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
