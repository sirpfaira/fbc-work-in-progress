"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IconWrapper from "@/app/components/common/IconWrapper";
import ThemeButton from "@/app/components/common/ThemeButton";
import { session } from "@/lib/constants";
import PunterAvatar from "@/app/components/common/PunterAvatar";
import Logo from "@/app/components/common/logo.svg";
import {
  EnMiddleNavItems,
  EnRightNavItems,
  EnSideBarItems,
} from "@/app/components/common/NavigationItems";
import { Bell, ChevronDown, LogOut, Menu, User } from "lucide-react";

export default function NavigationBar() {
  const url = usePathname();
  return (
    <header className="flex w-full justify-between lg:space-between items-center py-3 px-3 lg:px-4 bg-card shadow top-0 sticky z-50">
      <div className="flex items-center space-x-2 lg:w-[29%]">
        <Image
          src={Logo}
          alt="logo"
          width="32"
          height="32"
          className="hidden md:block"
        />
        <Link href="/">
          <span className="text-biggest font-medium">FreeBetCodes</span>
        </Link>
      </div>
      <div className="hidden lg:flex items-center justify-center space-x-16 text-muted-foreground lg:w-[40%]">
        <Link
          href={EnMiddleNavItems?.[0].link}
          key={EnMiddleNavItems?.[0].name}
          className={cn(
            url === EnMiddleNavItems?.[0].link && "text-primary",
            "relative"
          )}
        >
          {EnMiddleNavItems?.[0].icon}
          {url === EnMiddleNavItems?.[0].link && (
            <div className="absolute bg-primary -left-[40px] h-[3px] w-[110px] -bottom-[14px]"></div>
          )}
        </Link>
        {EnMiddleNavItems?.slice(1).map((item) => (
          <Link
            href={item.link}
            key={item.name}
            className={cn(
              url.startsWith(item.link) && "text-primary",
              "relative"
            )}
          >
            {item.icon}
            {url.startsWith(item.link) && (
              <div className="absolute bg-primary -left-[40px] h-[3px] w-[110px] -bottom-[14px]"></div>
            )}
          </Link>
        ))}
      </div>
      <div className="flex justify-end px-1 space-x-3 items-center font-medium lg:w-[29%]">
        <div className="hidden lg:flex space-x-3 ">
          {EnRightNavItems?.map((item) => (
            <Link href={item.link} key={item.name}>
              <IconWrapper>{item.icon}</IconWrapper>
            </Link>
          ))}
          <IconWrapper>
            <ThemeButton text={false} />
          </IconWrapper>
        </div>
        <IconWrapper>
          <Link className="relative" href={"/notifications"}>
            <Bell size={18} />
            <span className="absolute right-0 top-0 -mt-3 -mr-3 text-smallest bg-primary text-card font-medium px-1 rounded-full">
              37
            </span>
          </Link>
        </IconWrapper>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="hidden lg:flex items-center cursor-pointer px-1 relative">
              <span className="absolute right-0 bottom-0 -mb-1 p-0.5 text-xs bg-border shadow-lg rounded-full">
                <ChevronDown size={10} />
              </span>
              <PunterAvatar
                image={session?.user?.image}
                rating={session?.user?.rating}
                size={32}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="px-4 m-2 py-3 text-standard">
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"/account"} className="flex items-center space-x-2">
                <IconWrapper>
                  <User />
                </IconWrapper>
                <span className="font-semibold group-hover:text-primary">
                  My Account
                </span>
              </Link>
            </DropdownMenuItem>
            {session?.user && (
              <DropdownMenuItem>
                <button className="flex items-center space-x-2">
                  <IconWrapper>
                    <LogOut />
                  </IconWrapper>
                  <span className="font-semibold group-hover:text-primary">
                    Logout
                  </span>
                </button>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <IconWrapper>
                <Menu />
              </IconWrapper>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="px-4 m-2 py-3">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {EnSideBarItems?.map((item) => (
                <DropdownMenuItem key={item.name}>
                  <Link
                    href={item.link}
                    className="flex items-center space-x-2"
                  >
                    <IconWrapper>{item.icon}</IconWrapper>
                    <span className="text-standard font-semibold group-hover:text-primary">
                      {item.name}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem>
                <ThemeButton text={true} />
              </DropdownMenuItem>
              {session?.user && (
                <DropdownMenuItem>
                  <button className="flex items-center space-x-2">
                    <IconWrapper>
                      <LogOut />
                    </IconWrapper>
                    <span className="text-standard font-semibold group-hover:text-primary">
                      Logout
                    </span>
                  </button>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
