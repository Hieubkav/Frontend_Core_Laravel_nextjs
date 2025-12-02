import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZenDashboard",
  description: "Public site experience",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
