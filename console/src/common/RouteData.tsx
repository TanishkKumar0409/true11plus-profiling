import { LuUsers } from "react-icons/lu";
import { FiTool } from "react-icons/fi";
import { BiCategory, BiHome, BiLabel, BiSitemap, BiTask } from "react-icons/bi";

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
import StudentList from "../pages/students/StudentsList";
import StudentView from "../pages/students/StudentView";
import StudentTaskAssign from "../pages/students/StudentTaskAssign";
import StudentTaskView from "../pages/students/StudentTaskView";
import StudentParticularPost from "../pages/students/StudentParticularPost";

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
    name: "Students",
    id: "students",
    icon: LuUsers,
    href: "/dashboard/students",
    component: StudentList,
    roles: ["bot admin", "admin", "mentor"],
    permission: "read student",
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
    roles: ["bot admin", "admin", "editor"],
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
    name: "Student View",
    id: "student-view",
    href: "/dashboard/student/:objectId",
    component: StudentView,
    roles: ["bot admin", "admin", "mentor"],
    permission: "read student",
  },
  {
    name: "Student Task Assign",
    id: "student-task-assign",
    href: "/dashboard/student/:objectId/tasks/assign",
    component: StudentTaskAssign,
    roles: ["bot admin", "admin", "mentor"],
    permission: "read student task",
  },
  {
    name: "Student Task",
    id: "student-task",
    href: "/dashboard/student/:userId/tasks/:taskId",
    component: StudentTaskView,
    roles: ["bot admin", "admin", "mentor"],
    permission: "read student task",
  },
  {
    name: "Student Post",
    id: "student-post",
    href: "/dashboard/student/:userId/post/:postId",
    component: StudentParticularPost,
    roles: ["bot admin", "admin", "mentor"],
    permission: "read student post",
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
    roles: ["bot admin", "admin", "editor"],
    permission: "create task",
  },
  {
    name: "Task View",
    id: "task-view",
    href: "/dashboard/task/:objectId",
    component: TaskView,
    roles: ["bot admin", "admin", "editor"],
    permission: "read task",
  },
  {
    name: "Task Edit",
    id: "task-edit",
    href: "/dashboard/task/:objectId/edit",
    component: EditTask,
    roles: ["bot admin", "admin", "editor"],
    permission: "update task",
  },
];
