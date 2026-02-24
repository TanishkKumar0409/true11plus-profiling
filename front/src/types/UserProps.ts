export interface UserProps {
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
  about: string;
  title: string;
  mobile_private: boolean;
  email_private: boolean;
}

export interface ConnectionProps {
  _id: string;
  users: string[];
  status: "accepted" | "pending";
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}
