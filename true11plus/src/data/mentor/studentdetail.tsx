import { type StudentDashboardData, type ActivityFeedPost, type Task } from '../../types';

// Helper function to find student by ID
export const getStudentDetail = (id: string | undefined): StudentDashboardData | null => {
  if (!id) return null;
  return detailedStudents[id] || null;
};

// New Helper function to find a specific task
export const getTaskDetail = (studentId: string | undefined, taskId: string | undefined): Task | null => {
  if (!studentId || !taskId) return null;
  const student = detailedStudents[studentId];
  if (!student) return null;
  return student.tasks.find(t => t.id === taskId) || null;
};

/* --- SHARED MOCK DATA HELPERS --- */
const commonActivityFeed: ActivityFeedPost[] = [
  {
    id: 'post1',
    authorName: 'Student',
    authorInitials: 'S',
    timestamp: '2d ago',
    content: "Excited to start the new semester project!",
    likes: 5,
    comments: 1,
    shares: 0
  }
];

/* --- TASKS DATA FOR RAHUL --- */
const rahulTasks: Task[] = [
  {
    id: 't1',
    title: 'React Components Deep Dive',
    description: "Study the React component lifecycle methods and functional components. Implement a dashboard widget using the 'Compound Component' pattern. Focus on prop drilling vs context API usage.",
    status: 'Pending',
    priority: 'High',
    dueDate: 'Tomorrow, 5:00 PM',
    timeLeft: 'Tomorrow, 5:00 PM',
    project: 'Frontend Dev',
    subtasks: [
      { id: 'st1', title: 'Read Documentation on Hooks', isCompleted: true },
      { id: 'st2', title: 'Create Button Component', isCompleted: false },
      { id: 'st3', title: 'Implement Context API', isCompleted: false },
    ],
    attachments: [
      { id: 'att1', name: 'Design_Specs_v2.pdf', size: '2.4 MB', url: '#' },
      { id: 'att2', name: 'Reference_Assets.zip', size: '14 MB', url: '#' },
    ]
  },
  {
    id: 't2',
    title: 'UI/UX Final Submission',
    description: 'Submit the final UI/UX design for the course project.',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: 'in 3 days',
    timeLeft: 'in 3 days',
    project: 'UI/UX Design'
  },
  {
    id: 't3',
    title: 'Javascript Basics Quiz',
    description: 'Complete the quiz on JS fundamentals.',
    status: 'Completed',
    priority: 'Low',
    dueDate: 'Last week',
    submittedAt: 'Last week',
    project: 'Frontend Dev'
  },
  {
    id: 't4',
    title: 'Project Setup & Environment',
    description: 'Set up the development environment.',
    status: 'Completed',
    priority: 'High',
    dueDate: '2 weeks ago',
    submittedAt: '2 weeks ago',
    project: 'DevOps'
  }
];


const detailedStudents: Record<string, StudentDashboardData> = {

  // 1. RAHUL SHARMA
  '1': {
    profile: {
      id: '1',
      name: 'Rahul Sharma',
      role: 'Student',
      course: 'Computer Science',
      studentId: '#1992',
      status: 'Online',
      currentStatus: 'Active',
      overallProgress: 85,
      initials: 'R',
      about: 'Focused on Full Stack Development with React and Node.js. Passionate about building scalable web applications.',
      email: 'rahu******@gmail.com',
      phone: '+91 98******10',
      dateJoined: '12 Jan, 2024',
      location: 'New Delhi, India',
      nextSession: { date: 'Thursday, 24 Oct', time: '4:00 PM - 5:00 PM', status: 'Scheduled' }
    },
    stats: { totalCourses: 7, electives: 2, attendancePercentage: 60, missedClasses: 24, leavesRequested: 17, leavesApproved: 11 },
    todayClasses: [
      { id: 'c1', code: 'CS 102', subject: 'Circuit Theory', room: 'Room SF 13', time: '8:00 AM', status: 'Absent', colorClass: 'bg-purple-50 border-l-4 border-purple-400' },
      { id: 'c2', code: 'MAT 104', subject: 'Discrete Math', room: 'Room FF 10', time: '10:30 AM', status: 'Attended', colorClass: 'bg-lime-100 border-l-4 border-lime-400' },
    ],
    recentActivity: [
      { id: 'a1', title: 'Checked in for Discrete Math', timestamp: 'Today, 10:30 AM', type: 'check-in' },
      { id: 'a2', title: 'Completed Biometric Registration', timestamp: 'Today, 10:00 AM', type: 'registration' },
    ],
    activityFeed: [
      {
        id: 'post1',
        authorName: 'Rahul Sharma',
        authorInitials: 'R',
        timestamp: 'Just now',
        content: "Just finished the React Advanced Patterns module! The compound component pattern is really powerful for building reusable UI.",
        likes: 12, comments: 2, shares: 1
      },
      {
        id: 'post2',
        authorName: 'Rahul Sharma',
        authorInitials: 'R',
        timestamp: '1d ago',
        content: "Does anyone have resources for optimizing Next.js images? Im struggling with LCP scores.",
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        likes: 8, comments: 5, shares: 0
      }
    ],
    tasks: rahulTasks // <--- Added Tasks Here
  },

  // 2. ANANYA VERMA
  '2': {
    profile: {
      id: '2',
      name: 'Ananya Verma',
      role: 'Student',
      course: 'Business Management',
      studentId: '#2024',
      status: 'Online',
      currentStatus: 'Active',
      overallProgress: 72,
      initials: 'A',
      about: 'Aspiring business analyst with a keen interest in market trends and strategic planning.',
      email: 'ana******@gmail.com',
      phone: '+91 99******22',
      dateJoined: '15 Feb, 2024',
      location: 'Mumbai, India',
      nextSession: { date: 'Friday, 25 Oct', time: '2:00 PM - 3:00 PM', status: 'Scheduled' }
    },
    stats: { totalCourses: 5, electives: 1, attendancePercentage: 88, missedClasses: 5, leavesRequested: 4, leavesApproved: 4 },
    todayClasses: [
      { id: 'c3', code: 'MGT 101', subject: 'Business Ethics', room: 'Room A 22', time: '9:00 AM', status: 'Attended', colorClass: 'bg-blue-50 border-l-4 border-blue-400' },
    ],
    recentActivity: [
      { id: 'a3', title: 'Submitted Marketing Assignment', timestamp: 'Yesterday, 4:00 PM', type: 'assignment' },
    ],
    activityFeed: commonActivityFeed,
    tasks: [] // Initialize empty for now
  },

  // 3. AMIT KUMAR
  '3': {
    profile: {
      id: '3',
      name: 'Amit Kumar',
      role: 'Student',
      course: 'Engineering',
      studentId: '#3055',
      status: 'Offline',
      currentStatus: 'Inactive',
      overallProgress: 40,
      initials: 'A',
      about: 'Mechanical engineering student focused on robotics and automation.',
      email: 'am******@gmail.com',
      phone: '+91 70******33',
      dateJoined: '10 Mar, 2024',
      location: 'Bangalore, India',
      nextSession: { date: 'Monday, 28 Oct', time: '10:00 AM - 11:00 AM', status: 'Scheduled' }
    },
    stats: { totalCourses: 6, electives: 2, attendancePercentage: 45, missedClasses: 30, leavesRequested: 10, leavesApproved: 2 },
    todayClasses: [],
    recentActivity: [
      { id: 'a4', title: 'Missed Thermodynamics Class', timestamp: 'Today, 9:00 AM', type: 'check-in' },
    ],
    activityFeed: [],
    tasks: [] // Initialize empty for now
  },

  // 4. SNEHA PATEL
  '4': {
    profile: {
      id: '4',
      name: 'Sneha Patel',
      role: 'Student',
      course: 'Design',
      studentId: '#4102',
      status: 'Online',
      currentStatus: 'Active',
      overallProgress: 95,
      initials: 'S',
      about: 'Creative designer specializing in UI/UX and digital illustration.',
      email: 'sne******@gmail.com',
      phone: '+91 88******44',
      dateJoined: '05 Apr, 2024',
      location: 'Ahmedabad, India',
      nextSession: { date: 'Tuesday, 29 Oct', time: '11:00 AM - 12:00 PM', status: 'Scheduled' }
    },
    stats: { totalCourses: 4, electives: 3, attendancePercentage: 98, missedClasses: 1, leavesRequested: 2, leavesApproved: 2 },
    todayClasses: [
      { id: 'c4', code: 'DES 201', subject: 'Color Theory', room: 'Studio 4', time: '11:00 AM', status: 'Attended', colorClass: 'bg-pink-50 border-l-4 border-pink-400' },
      { id: 'c5', code: 'DES 205', subject: 'Digital Art', room: 'Lab 2', time: '2:00 PM', status: 'Upcoming', colorClass: 'bg-yellow-50 border-l-4 border-yellow-400' },
    ],
    recentActivity: [
      { id: 'a5', title: 'Uploaded Portfolio Project', timestamp: 'Today, 9:30 AM', type: 'assignment' },
    ],
    activityFeed: commonActivityFeed,
    tasks: [] // Initialize empty for now
  }
};