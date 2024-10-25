import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const config = {
  auth: {
    enabled: true,
  },
  payments: {
    enabled: true,
  },
};

export default function AdminProfileButton() {
  const router = useRouter();

  if (!config?.auth?.enabled) {
    router.back();
  }
  const user = { imageUrl: "https://randomuser.me/api/portraits/men/64.jpg" };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-[2.25rem] h-[2.25rem]">
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.imageUrl} alt="User Profile" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 px-2 pb-2">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/user-profile">
          <DropdownMenuItem className="menu-item cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/dashboard/settings">
          <DropdownMenuItem className="menu-item cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem className="menu-item cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
