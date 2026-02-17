import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Intelligence | B2B CareerTech",
  description: "Advanced job notification tracking for placement cells and recruitment agencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
