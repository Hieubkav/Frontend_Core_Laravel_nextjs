import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZenDashboard Admin",
  description: "Admin area for ZenDashboard",
};

export default function AdminRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
