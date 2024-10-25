"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminNavigationItems } from "@/app/components/common/NavigationItems";

export default function DashboardSideBar() {
  const pathname = usePathname();

  return (
    <div className="lg:block hidden border-r border-border h-screen bg-card sticky left-0 top-0">
      <div className="flex h-full max-h-screen flex-col gap-2 ">
        <div className="flex h-[55px] items-center justify-between border-b border-border px-3 w-full">
          <Link className="flex items-center gap-2 ml-1" href="/">
            <span className="font-semibold text-big">FreeBetCodes</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2 ">
          <nav className="grid items-start px-4 text-sm font-medium gap-y-1">
            {AdminNavigationItems.map((item) => (
              <Link
                key={item.link}
                className={clsx(
                  "flex items-center gap-2 rounded-lg px-3 py-2 transition-all menu-item group hover:my-1",
                  pathname === item.link &&
                    "bg-muted-block text-icon-active font-semibold"
                )}
                href={item.link}
              >
                <div
                  className={clsx(
                    "border  rounded-lg p-1",
                    pathname === item.link && "border-primary text-icon-active",
                    pathname !== item.link &&
                      "border-outline text-icon-inactive group-hover:border-primary group-hover:text-icon-active"
                  )}
                >
                  {item.icon}
                </div>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
