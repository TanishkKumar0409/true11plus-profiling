export interface UserProps extends Record<string, unknown> {
  _id: string;
  username: string;
  name: string;
  banner: string[];
  avatar: string[];
  email: string;
  mobile_no: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  verified: boolean;
  role: string;
  website: string;
  status: string;
  permissions: string[];
  createdAt: string;
}

export interface Permission {
  _id: string;
  title: string;
}

export interface PermissionDoc {
  permissions: Permission[];
}
export interface RoleProps {
  _id: string;
  role: string;
}
