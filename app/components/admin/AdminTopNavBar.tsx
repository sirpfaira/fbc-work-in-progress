"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose } from "@/components/ui/dialog";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import AdminProfileButton from "@/app/components/admin/AdminProfileButton";
import ThemeButton from "@/app/components/common/ThemeButton";
import { AdminNavigationItems } from "@/app/components/common/NavigationItems";

const config = {
  auth: {
    enabled: true,
  },
  payments: {
    enabled: true,
  },
};

export default function DashboardTopNav({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col space-y-4">
      <header className="flex h-14 lg:h-[55px] items-center gap-4 border-b border-border px-3 bg-card sticky left-0 top-0">
        <Dialog>
          <SheetTrigger className="min-[1024px]:hidden p-2 transition">
            <Menu />
            <Link href="/dashboard">
              <span className="sr-only">Home</span>
            </Link>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <Link href="/" className="flex justify-start w-full">
                <SheetTitle>FreeBetCodes</SheetTitle>
              </Link>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-[1rem] overflow-auto">
              {AdminNavigationItems.map((item) => (
                <DialogClose asChild key={item.link} className="w-full">
                  <Link href={item.link} className="w-full  ">
                    <Button
                      variant="outline"
                      className="flex justify-start w-full space-x-2"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                </DialogClose>
              ))}
            </div>
          </SheetContent>
        </Dialog>
        <span className="inline-block font-semibold text-big lg:hidden">
          FreeBetCodes
        </span>
        <div className="flex justify-center items-center gap-2 ml-auto">
          <ThemeButton />
          {config?.auth?.enabled && <AdminProfileButton />}
        </div>
      </header>
      <div className="flex flex-col px-2 lg:px-5">{children}</div>
    </div>
  );
}
