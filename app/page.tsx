import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full justify-center items-center min-h-screen gap-y-4 divide-x">
      <div className="flex flex-col w-1/5 space-y-4 px-4 justify-center items-center">
        <Link href="/en" className={buttonVariants({ variant: "outline" })}>
          EN Homepage
        </Link>
        <Link
          href="/en/test"
          className={buttonVariants({ variant: "outline" })}
        >
          EN Test
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "default" })}>
          Login
        </Link>
        <Link href="/admin" className={buttonVariants({ variant: "default" })}>
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
}
