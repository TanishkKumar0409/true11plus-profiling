export interface UserProps extends Record<string, unknown> {
  _id: string;
  username: string;
  name: string;
  email: string;
  mobile_no: string;
  role: string;
  verified: boolean;
  status: string;
  createdAt: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  avatar: string[];
  banner: string[];
  website: string;
  title: string;
  about: string;
}

export interface RoleProps {
  _id: string;
  role: string;
}

export interface UserExperience {
  _id?: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string;
  iscurrently: boolean;
  description: string;
}

export interface UserEducation {
  _id?: string;
  student_class: string;
  school: string;
  academic_year: string;
  description: string;
  pursuing: boolean;
}

export interface GlobalLanguage {
  _id: string;
  language: string;
}

export interface UserLanguage {
  _id?: string;
  languageId?: string; // Reference to global ID
  language?: string; // Fallback name if populated or optimistic
}
