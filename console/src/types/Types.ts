import type { RoleProps, UserProps } from "./UserProps";

export interface TokenConfimationProps {
  loading: boolean;
  success: boolean;
  error: string;
  title: string;
  message: string;
}

export interface Column<T> {
  value: keyof T | ((row: T) => React.JSX.Element);
  label: string;
  key?: string;
}
export interface DashboardOutletContextProps {
  authUser: UserProps | null;
  authLoading: boolean;
  getAuthUser: () => void;
  getRoleById: (id: string) => string;
  roles: RoleProps[];
  allStatus: StatusProps[];
  getAllStatus: () => void;
  allCategory: CategoryProps[];
  getAllCategory: () => void;
  startLoadingBar: () => void;
  stopLoadingBar: () => void;
}

export interface FieldDataSimple {
  title: string;
  value: number;
}

export interface CityProps {
  name: string;
  state_name: string;
}

export interface StateProps {
  country_name: string;
  name: string;
}

export interface CountryProps {
  country_name: string;
}

export interface StatusProps extends Record<string, unknown> {
  _id: string;
  status_name: string;
  parent_status: string;
  createdAt: string;
  description: string;
}

export interface CategoryProps extends Record<string, unknown> {
  _id: string;
  category_name: string;
  parent_category: string;
  createdAt: string;
  description: string;
  status: string;
}
