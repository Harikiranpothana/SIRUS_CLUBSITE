import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "S.I.R.U.S. — Super Intelligence Research & Innovation System",
  description:
    "A student-driven ecosystem for research, experimentation and technical innovation.",
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