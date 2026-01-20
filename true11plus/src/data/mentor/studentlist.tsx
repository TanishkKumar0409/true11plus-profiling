// src/data/mockData.ts

export interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  progress: number;
  status: 'Active' | 'Inactive';
  initials: string;
  avatarColor: string;
}

export const studentsData: Student[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahu******@gmail.com',
    course: 'Computer Science',
    progress: 85,
    status: 'Active',
    initials: 'R',
    avatarColor: 'bg-indigo-100 text-indigo-600',
  },
  {
    id: 2,
    name: 'Ananya Verma',
    email: 'ana******@gmail.com',
    course: 'Business Management',
    progress: 72,
    status: 'Active',
    initials: 'A',
    avatarColor: 'bg-blue-100 text-blue-600',
  },
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'am******@gmail.com',
    course: 'Engineering',
    progress: 40,
    status: 'Inactive',
    initials: 'A',
    avatarColor: 'bg-purple-100 text-purple-600',
  },
  {
    id: 4,
    name: 'Sneha Patel',
    email: 'sne******@gmail.com',
    course: 'Design',
    progress: 95,
    status: 'Active',
    initials: 'S',
    avatarColor: 'bg-violet-100 text-violet-600',
  },
];