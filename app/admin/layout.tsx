import { ReactNode } from "react";
import AdminSideBar from "@/app/components/admin/AdminSideBar";
import AdminTopNavBar from "@/app/components/admin/AdminTopNavBar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AdminSideBar />
      <AdminTopNavBar>
        <main className="flex flex-col gap-4 p-4 lg:gap-6">{children}</main>
      </AdminTopNavBar>
    </div>
  );
}
