"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { EnMiddleNavItems } from "@/app/components/common/NavigationItems";

const BottomNavigationBar = () => {
  const url = usePathname();

  return (
    <div className="flex lg:hidden w-full py-4 px-2 text-muted-foreground text-smallest font-medium bg-card shadow-[10px_5px_10px_0px_rgba(0,0,15,0.5)] bottom-0 fixed z-50">
      <div className="flex justify-center items-center flex-1 group">
        <Link
          href={EnMiddleNavItems?.[0].link}
          key={EnMiddleNavItems?.[0].name}
          className={cn(
            url === EnMiddleNavItems?.[0].link && "text-primary",
            "justify-center items-center flex flex-col flex-1 group"
          )}
        >
          {EnMiddleNavItems?.[0].icon}
          {url === EnMiddleNavItems?.[0].link && (
            <div className="relative w-full">
              <div className="absolute bg-primary left-0 h-[3px] w-[100%] -bottom-[14px]"></div>
            </div>
          )}
        </Link>
      </div>
      {EnMiddleNavItems?.slice(1, 5).map((item) => (
        <Link
          href={item.link}
          key={item.name}
          className={cn(
            url.startsWith(item.link) && "text-primary",
            "justify-center items-center flex flex-col flex-1 group"
          )}
        >
          {item.icon}

          {url.startsWith(item.link) && (
            <div className="relative w-full">
              <div className="absolute bg-primary left-0 h-[3px] w-[100%] -bottom-[14px]"></div>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

export default BottomNavigationBar;
