import { Banknote, Folder, HomeIcon, Settings } from "lucide-react";

export const AdminNavigationItems = [
  { label: "Home", link: "/admin", icon: <HomeIcon size={14} /> },
  { label: "Test", link: "/admin/test", icon: <Banknote size={14} /> },
  {
    label: "Manage Countries",
    link: "/admin/manage-countries",
    icon: <Folder size={14} />,
  },
  {
    label: "Manage Competitions",
    link: "/admin/manage-competitions",
    icon: <Settings size={14} />,
  },
  { label: "Settings", link: "/admin/settings", icon: <Settings size={14} /> },
];
