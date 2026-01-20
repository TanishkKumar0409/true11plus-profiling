import { MdDashboard } from "react-icons/md";
import Dashboard from "../pages/dashboard/Dashboard";
import Activity from "../pages/activity/Activity";
import { CgWorkAlt } from "react-icons/cg";
import ProfileEdit from "../pages/profile/ProfileEdit";

export const SidbarNavigations = [
  {
    name: "Dashboard",
    id: "dashboard",
    icon: MdDashboard,
    href: "/",
    component: Dashboard,
  },
  {
    name: "Activity",
    id: "activity",
    icon: CgWorkAlt,
    href: "/activity",
    component: Activity,
  },
];
export const NonSidebarNavigations = [
  {
    name: "Profile Edit",
    id: "profiel-edit",
    href: "/profile/edit",
    component: ProfileEdit,
  },
];
export const AuthNavigations = [];
export const PublicNavigations = [];
