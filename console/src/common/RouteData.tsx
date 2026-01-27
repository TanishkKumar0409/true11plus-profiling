import { LuUsers } from "react-icons/lu";
import { FiTool } from "react-icons/fi";
import { BiCategory, BiHome, BiLabel, BiSitemap, BiTask } from "react-icons/bi";

import LoginPage from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import ResetPasswordConfirm from "../pages/auth/ResetPasswordConfirm";
import ResetPasswordSend from "../pages/auth/ResetPasswordEmailSend";
import VerifyEmailConfirm from "../pages/auth/VerifyEmailConfrim";
import VerifyEmail from "../pages/auth/VerifyEmailSend";
import Dashboard from "../pages/dashboard/Dashboard";
import UserList from "../pages/users/UserList";
import UserView from "../pages/users/UserView";
import UserEdit from "../pages/users/UserEdit";
import AdminAssets from "../pages/admin-assets/AdminAssets";
import CreateStatus from "../pages/status/CreateStatus";
import StatusList from "../pages/status/StatusList";
import ViewStatus from "../pages/status/ViewStatus";
import EditStatus from "../pages/status/EditStatus";
import CreateCategory from "../pages/category/CreateCategory";
import CategoryList from "../pages/category/CategoryList";
import EditCategory from "../pages/category/EditCategory";
import CategoryView from "../pages/category/CategoryView";
import AcademicStructure from "../pages/academic-structure/AcademicStructure";
import CreateTask from "../pages/academic-structure/tasks/CreateTask";
import Tasks from "../pages/academic-structure/tasks/Tasks";
import TaskView from "../pages/academic-structure/tasks/TaskView";
import EditTask from "../pages/academic-structure/tasks/EditTask";

// Import your components (Dashboard, UserList, etc.) here
// import Dashboard from "...";
// ...

export const SidbarNavigations = [
  {
    name: "Dashboard",
    id: "dashboard",
    icon: BiHome,
    href: "/dashboard",
    component: Dashboard,
    roles: ["bot admin", "admin", "mentor", "editor"],
  },
  {
    name: "Users",
    id: "users",
    icon: LuUsers,
    href: "/dashboard/users",
    component: UserList,
    roles: ["bot admin", "admin"],
    permission: "read user",
  },
  {
    name: "Academic Structure",
    id: "academic structure",
    icon: BiSitemap,
    href: "/dashboard/academic-structure",
    component: AcademicStructure,
    roles: ["bot admin", "admin"],
    permission: "read user",
  },
  {
    name: "Status",
    id: "status",
    icon: BiLabel,
    href: "/dashboard/status",
    component: StatusList,
    roles: ["bot admin"],
    permission: "read status",
  },
  {
    name: "Category",
    id: "category",
    icon: BiCategory,
    href: "/dashboard/category",
    component: CategoryList,
    roles: ["bot admin"],
    permission: "read category",
  },
  {
    name: "Tasks",
    id: "tasks",
    icon: BiTask,
    href: "/dashboard/tasks",
    component: Tasks,
    roles: ["bot admin", "admin"],
    permission: "read task",
  },
  {
    name: "Admin Assets",
    id: "admin-assets",
    icon: FiTool,
    href: "/dashboard/admin/assets",
    component: AdminAssets,
    roles: ["bot admin"],
    permission: "read admin assets",
  },
];
export const NonSidebarNavigations = [
  {
    name: "User View",
    id: "user-view",
    href: "/dashboard/user/:objectId",
    component: UserView,
    roles: ["bot admin", "admin"],
    permission: "read user",
  },
  {
    name: "User Edit",
    id: "user-edit",
    href: "/dashboard/user/:objectId/edit",
    component: UserEdit,
    roles: ["bot admin", "admin"],
    permission: "update user",
  },
  {
    name: "Status Create",
    id: "status-create",
    href: "/dashboard/status/create",
    component: CreateStatus,
    roles: ["bot admin"],
    permission: "create status",
  },
  {
    name: "Status View",
    id: "status-view",
    href: "/dashboard/status/:objectId",
    component: ViewStatus,
    roles: ["bot admin"],
    permission: "read status",
  },
  {
    name: "Status Edit",
    id: "status-edit",
    href: "/dashboard/status/:objectId/edit",
    component: EditStatus,
    roles: ["bot admin"],
    permission: "update status",
  },
  {
    name: "category Create",
    id: "category-create",
    href: "/dashboard/category/create",
    component: CreateCategory,
    roles: ["bot admin"],
    permission: "create category",
  },
  {
    name: "category View",
    id: "category-view",
    href: "/dashboard/category/:objectId",
    component: CategoryView,
    roles: ["bot admin"],
    permission: "read category",
  },
  {
    name: "category Edit",
    id: "category-edit",
    href: "/dashboard/category/:objectId/edit",
    component: EditCategory,
    roles: ["bot admin"],
    permission: "update category",
  },
  {
    name: "Task Create",
    id: "task-create",
    href: "/dashboard/task/create",
    component: CreateTask,
    roles: ["bot admin", "admin"],
    permission: "create task",
  },
  {
    name: "Task View",
    id: "task-view",
    href: "/dashboard/task/:objectId",
    component: TaskView,
    roles: ["bot admin", "admin"],
    permission: "read task",
  },
  {
    name: "Task Edit",
    id: "task-edit",
    href: "/dashboard/task/:objectId/edit",
    component: EditTask,
    roles: ["bot admin", "admin"],
    permission: "update task",
  },
];
export const AuthNavigations = [
  {
    name: "Login",
    id: "login",
    href: "/",
    component: LoginPage,
    guestOnly: true,
  },
  {
    name: "Register",
    id: "register",
    href: "/auth/register",
    component: Register,
    guestOnly: true,
  },
  {
    name: "Verify Swal",
    href: "/auth/verify-email/:email",
    component: VerifyEmail,
    public: true,
  },
  {
    name: "Verify Email",
    href: "/auth/verify-email/confirm/:token",
    component: VerifyEmailConfirm,
    public: true,
  },
];
export const PublicNavigations = [
  {
    name: "Forgot Password",
    href: "/auth/reset-password",
    component: ResetPassword,
    public: true,
  },
  {
    name: "Forgot Password Swal",
    href: "/auth/reset-password/send/:email",
    component: ResetPasswordSend,
    public: true,
  },
  {
    name: "Reset Password",
    href: "/auth/reset-password/confirm/:token",
    component: ResetPasswordConfirm,
    public: true,
  },
];
