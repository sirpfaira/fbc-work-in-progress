import {
  Banknote,
  ChartNoAxesColumn,
  Flame,
  Folder,
  HomeIcon,
  House,
  Layers,
  PersonStanding,
  Settings,
  SquarePen,
  Star,
  Trophy,
  User,
  Volleyball,
  Youtube,
} from "lucide-react";

export const AdminNavigationItems = [
  { label: "Home", link: "/admin", icon: <HomeIcon size={14} /> },
  {
    label: "Manage Trending",
    link: "/admin/manage-trending",
    icon: <Flame size={14} />,
  },
  {
    label: "Manage Bets",
    link: "/admin/manage-bets",
    icon: <Layers size={14} />,
  },
  {
    label: "Manage Dummies",
    link: "/admin/manage-dummies",
    icon: <User size={14} />,
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
    label: "Manage Competitions",
    link: "/admin/manage-competitions",
    icon: <Settings size={14} />,
  },
  {
    label: "Manage Teams",
    link: "/admin/manage-teams",
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

export const EnMiddleNavItems = [
  { name: "Home", icon: <House size={32} />, link: "/en" },
  { name: "Trending", icon: <Flame size={32} />, link: "/en/trending" },
  { name: "Bets", icon: <Layers size={32} />, link: "/en/bets" },
  { name: "Challenges", icon: <Trophy size={32} />, link: "/en/challenges" },
  { name: "Playground", icon: <Youtube size={32} />, link: "/en/playground" },
];

export const EnRightNavItems = [
  { name: "Create", icon: <SquarePen size={18} />, link: "/en/create" },
  {
    name: "Leaderboard",
    icon: <ChartNoAxesColumn size={18} />,
    link: "/en/punters",
  },
];

export const EnSideBarItems = [
  { name: "Create", icon: <SquarePen size={18} />, link: "/en/create" },
  {
    name: "Leaderboard",
    icon: <ChartNoAxesColumn size={18} />,
    link: "/en/punters",
  },
  {
    name: "Run Or Stay",
    icon: <PersonStanding size={18} />,
    link: "/en/runorstay",
  },
  { name: "Fixtures", icon: <Volleyball size={18} />, link: "/en/fixtures" },
  { name: "Starred", icon: <Star size={18} />, link: "/en/starred" },
  { name: "My Account", icon: <User size={18} />, link: "/en/account" },
];

export const EnFooterItems = [
  { name: "About", link: "/en" },
  { name: "Privacy Policy", link: "/en" },
  { name: "Help", link: "/en" },
  { name: "Contact", link: "/en" },
];
