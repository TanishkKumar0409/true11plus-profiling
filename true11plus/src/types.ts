// src/types.ts

export interface ClassSession {
  id: string;
  code: string;
  subject: string;
  room: string;
  time: string;
  status: 'Attended' | 'Absent' | 'Upcoming';
  colorClass: string; // For the background color (purple/green)
}

export interface ActivityLog {
  id: string;
  title: string;
  timestamp: string;
  type: 'check-in' | 'registration' | 'assignment';
}

export interface StudentStats {
  totalCourses: number;
  electives: number;
  attendancePercentage: number;
  missedClasses: number;
  leavesRequested: number;
  leavesApproved: number;
}

export interface StudentDetailProfile {
  id: string;
  name: string;
  role: string;
  course: string;
  studentId: string;
  status: 'Online' | 'Offline';
  currentStatus: 'Active' | 'Inactive';
  overallProgress: number; // 0-100
  initials: string;
}

export interface StudentDashboardData {
  profile: StudentDetailProfile;
  stats: StudentStats;
  todayClasses: ClassSession[];
  recentActivity: ActivityLog[];
}

export interface MentorshipSession {
  date: string; // e.g., "Thursday, 24 Oct"
  time: string; // e.g., "4:00 PM - 5:00 PM"
  status: 'Scheduled' | 'Completed';
}

export interface StudentDetailProfile {
  id: string;
  name: string;
  role: string;
  course: string;
  studentId: string;
  status: 'Online' | 'Offline';
  currentStatus: 'Active' | 'Inactive';
  overallProgress: number;
  initials: string;
  // New fields for Profile Tab
  about: string;
  email: string;
  phone: string;
  dateJoined: string;
  location: string;
  nextSession: MentorshipSession;
}

export interface StudentDashboardData {
  profile: StudentDetailProfile;
  stats: StudentStats;
  todayClasses: ClassSession[];
  recentActivity: ActivityLog[];
}

// src/types.ts

// ... existing types (MentorshipSession, StudentDetailProfile, etc.) ...

// New type for the Activity Logs Tab
export interface ActivityFeedPost {
  id: string;
  authorName: string;
  authorInitials: string;
  timestamp: string;
  content: string;
  image?: string; // Optional image URL
  likes: number;
  comments: number;
  shares: number;
}

export interface StudentDashboardData {
  profile: StudentDetailProfile;
  stats: StudentStats;
  todayClasses: ClassSession[];
  recentActivity: ActivityLog[];
  // Add the new activity feed to the main data structure
  activityFeed: ActivityFeedPost[];
}

// src/types.ts

// ... existing interfaces ...

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  timeLeft?: string; // e.g., "Tomorrow, 5:00 PM"
  submittedAt?: string; // For completed tasks
  project?: string;
  subtasks?: Subtask[];
  attachments?: Attachment[];
}

export interface StudentDashboardData {
  // ... existing fields ...
  tasks: Task[]; // Add the tasks array to the main data structure
}