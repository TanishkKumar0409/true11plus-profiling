import type { UserProps } from "./UserTypes";

export interface DashboardOutletContextProps {
  authUser: UserProps | null;
  authLoading: boolean;
  getAuthUser: () => void;
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
