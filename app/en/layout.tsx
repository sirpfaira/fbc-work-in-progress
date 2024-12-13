import NavigationBar from "@/app/components/en/NavigationBar";
import LeftSideBar from "@/app/components/en/LeftSideBar";
import RightSideBar from "@/app/components/en/RightSideBar";
import BottomNavigationBar from "@/app/components/en/BottomNavigationBar";

export default function ENLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto">
      <NavigationBar />
      <LeftSideBar />
      <RightSideBar />
      <BottomNavigationBar />
      <div className="flex flex-col w-full mx-auto max-w-[500px] mb-10">
        <div className="flex flex-col space-y-4 px-2 md:px-4 lg:px-6 min-h-[85vh] mt-5">
          {children}
          <span className="h-4"></span>
        </div>
      </div>
    </div>
  );
}
