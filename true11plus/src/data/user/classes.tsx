// src/data/user/program.js

export const mockClasses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    instructor: "Sarah Jenkins",
    date: "10 Jan 2026",
    time: "10:00 AM - 12:00 PM",
    level: "Advanced",
    description: "Deep dive into HOCs, Render Props, and Custom Hooks to build scalable applications.",
    studentsEnrolled: 45,
    meetingUrl: "https://zoom.us/j/123456789",
    tasks: [
      { id: 101, title: "Read Chapter 4: Composition", status: "Completed", dueDate: "Jan 12" },
      { id: 102, title: "Submit Custom Hook Assignment", status: "Pending", dueDate: "Jan 15" },
      { id: 103, title: "Peer Review: Context API", status: "Not Started", dueDate: "Jan 18" },
    ]
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    instructor: "Mike Chen",
    date: "12 Jan 2026",
    time: "02:00 PM - 04:00 PM",
    level: "Beginner",
    description: "Learn the core principles of user-centric design, wireframing, and prototyping in Figma.",
    studentsEnrolled: 32,
    meetingUrl: "https://zoom.us/j/987654321",
    tasks: [
      { id: 201, title: "Create Wireframes for Login", status: "Completed", dueDate: "Jan 11" },
      { id: 202, title: "Color Theory Quiz", status: "Completed", dueDate: "Jan 13" },
      { id: 203, title: "Final Prototype Submission", status: "Pending", dueDate: "Jan 20" },
    ]
  },
  {
    id: 3,
    title: "Node.js Microservices",
    instructor: "Rahul Sharma",
    date: "15 Jan 2026",
    time: "11:00 AM - 01:00 PM",
    level: "Intermediate",
    description: "Building scalable backend systems using Node.js, Express, and MongoDB aggregation.",
    studentsEnrolled: 28,
    meetingUrl: "https://zoom.us/j/456123789",
    tasks: [
      { id: 301, title: "Setup MongoDB Cluster", status: "Pending", dueDate: "Jan 16" },
      { id: 302, title: "API Authentication JWT", status: "Not Started", dueDate: "Jan 19" },
    ]
  },
  {
    id: 4,
    title: "Python for Data Science",
    instructor: "Emily Davis",
    date: "18 Jan 2026",
    time: "09:00 AM - 11:00 AM",
    level: "Beginner",
    description: "Introduction to Pandas, NumPy, and data visualization using Matplotlib.",
    studentsEnrolled: 50,
    meetingUrl: "https://zoom.us/j/789456123",
    tasks: [
      { id: 401, title: "Install Anaconda & Jupyter", status: "Completed", dueDate: "Jan 10" },
      { id: 402, title: "Pandas Dataframe Exercise", status: "Not Started", dueDate: "Jan 22" },
      { id: 403, title: "Visualization Project Proposal", status: "Not Started", dueDate: "Jan 25" },
    ]
  }
];