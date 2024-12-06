import { Banknote, Folder, HomeIcon, Settings } from "lucide-react";

export const AdminNavigationItems = [
  { label: "Home", link: "/admin", icon: <HomeIcon size={14} /> },
  {
    label: "Manage Bets",
    link: "/admin/manage-bets",
    icon: <HomeIcon size={14} />,
  },
  {
    label: "Manage Punters",
    link: "/admin/manage-punters",
    icon: <HomeIcon size={14} />,
  },
  {
    label: "Manage Fixtures",
    link: "/admin/manage-fixtures",
    icon: <HomeIcon size={14} />,
  },
  {
    label: "Manage Platforms",
    link: "/admin/manage-platforms",
    icon: <Settings size={14} />,
  },
  {
    label: "Manage Odd Selectors",
    link: "/admin/manage-oddselectors",
    icon: <Folder size={14} />,
  },
  {
    label: "Manage Teams",
    link: "/admin/manage-teams",
    icon: <Settings size={14} />,
  },
  {
    label: "Manage Competitions",
    link: "/admin/manage-competitions",
    icon: <Settings size={14} />,
  },
  {
    label: "Manage Countries",
    link: "/admin/manage-countries",
    icon: <Folder size={14} />,
  },
  { label: "Test", link: "/admin/test", icon: <Banknote size={14} /> },
  { label: "Settings", link: "/admin/settings", icon: <Settings size={14} /> },
];

// {
//   label: "Manage Trending",
//   link: "/admin/manage-trending",
//   icon: <HomeIcon size={14} />,
// },
// {
//   label: "Manage Codes",
//   link: "/admin/manage-codes",
//   icon: <HomeIcon size={14} />,
// },
