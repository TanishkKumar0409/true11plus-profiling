import { MdDashboard } from "react-icons/md";
import Dashboard from "../pages/dashboard/Dashboard";
import Activity from "../pages/activity/Activity";
import { CgWorkAlt } from "react-icons/cg";
import ProfileEdit from "../pages/profile/ProfileEdit";
import { BiTask } from "react-icons/bi";
import Task from "../pages/task/Task";
import TaskView from "../pages/task/TaskView";
import SinglePostPage from "../pages/activity/PostComments";

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
  {
    name: "Tasks",
    id: "task",
    icon: BiTask,
    href: "/task",
    component: Task,
  },
];
export const NonSidebarNavigations = [
  {
    name: "Profile Edit",
    id: "profiel-edit",
    href: "/profile/edit",
    component: ProfileEdit,
  },
  {
    name: "Task View",
    id: "task-view",
    href: "/task/:objectId",
    component: TaskView,
  },
  {
    name: "Activity View",
    id: "activity-view",
    href: "/activity/:objectId",
    component: SinglePostPage,
  },
];
export const AuthNavigations = [];
export const PublicNavigations = [];
