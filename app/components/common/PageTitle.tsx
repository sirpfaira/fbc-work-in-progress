import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface PageTitleProps {
  title: string;
  link: string;
}

const PageTitle = ({ title, link }: Readonly<PageTitleProps>) => {
  return (
    <div className="flex items-center space-x-1">
      <Link href={link}>
        <ChevronLeft size={28} />
      </Link>
      <span className="text-big font-medium">{title}</span>
    </div>
  );
};

export default PageTitle;
