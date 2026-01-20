// File: src/data/mentorData.ts

export interface Mentor {
  id: number;
  name: string;
  initial: string;
  email: string;
  specialization: string;
  progress: number;
  status: 'Active' | 'Inactive';
  avatarColor: string;
}

export const mentorsData: Mentor[] = [
  { id: 1, name: "Dr. Rahul Sharma", initial: "D", email: "rahul******@gmail.com", specialization: "Computer Science", progress: 85, status: "Active", avatarColor: "bg-blue-100 text-blue-600" },
  { id: 2, name: "Prof. Ananya Verma", initial: "P", email: "ana******@gmail.com", specialization: "Business Management", progress: 60, status: "Active", avatarColor: "bg-green-100 text-green-600" },
  { id: 3, name: "Er. Amit Kumar", initial: "E", email: "amit******@gmail.com", specialization: "Engineering", progress: 20, status: "Inactive", avatarColor: "bg-emerald-100 text-emerald-600" },
  { id: 4, name: "Sneha Patel", initial: "S", email: "sne******@gmail.com", specialization: "UI/UX Design", progress: 95, status: "Active", avatarColor: "bg-yellow-100 text-yellow-600" },
];