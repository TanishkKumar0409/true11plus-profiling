import Register from "../pages/auth/Register";

export const SidbarNavigations = [];
export const NonSidebarNavigations = [];
export const AuthNavigations = [
  {
    name: "Register",
    id: "register",
    href: "/auth/register",
    component: Register,
    guestOnly: true,
  },
];
export const PublicNavigations = [];
