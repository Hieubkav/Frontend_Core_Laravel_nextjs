import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZenDashboard",
  description: "ZenDashboard website and admin portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
