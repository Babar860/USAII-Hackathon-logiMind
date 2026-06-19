import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LogiMind AI",
  description: "Predictive logistics decision-support agent"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
