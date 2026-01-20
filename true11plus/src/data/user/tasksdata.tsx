import { Trophy, Users, FileText, Globe } from 'lucide-react';

export const universities = [
  "HARVARD", "OXFORD", "CAMBRIDGE", "STANFORD", "MIT", "YALE"
];

export const modules = [
  {
    id: 1,
    category: "Class 6",
    tag: "2 Weeks",
    title: "The Global Young Leaders Conference",
    description: "An intensive introduction to global leadership. We break down the fundamentals of international relations and how to position yourself as a thought leader.",
    tasks: [
        "Introduction to International Relations & Diplomacy",
        "Workshop: Deconstructing the UN Sustainable Development Goals",
        "Case Study: Analysis of 21st Century Geopolitical Conflicts",
        "Assignment: Draft a Policy Brief for a Global Issue"
    ],
    tags: ["Global Leadership", "Public Speaking", "Problem Solving"]
  },
  {
    id: 2,
    category: "Class 7",
    tag: "4 Weeks",
    title: "Public Speaking and Debate Workshop",
    description: "Master the art of persuasion. This module focuses on rhetoric, body language, and the structure of winning arguments.",
    tasks: [
        "The Rhetoric Triangle: Ethos, Pathos, Logos",
        "Impromptu Speaking Drills (Table Topics)",
        "Debate Structure: Constructive Speeches vs. Rebuttals",
        "Final Deliverable: 5-Minute Persuasive Speech"
    ],
    tags: ["Rhetoric & Logic", "Debate Structure", "Confidence Building"]
  },
  {
    id: 3,
    category: "Class 8",
    tag: "3 Weeks",
    title: "Critical Thinking & Logic",
    description: "Learn to analyze arguments and identify fallacies. This is the exact skill set required for Oxbridge interviews and Ivy League essays.",
    tasks: [
        "Identifying Logical Fallacies in Media",
        "Socratic Seminars: Questioning the Status Quo",
        "Game Theory Basics for Decision Making",
        "Mock Interview Session: Logic Puzzles"
    ],
    tags: ["Logical Analysis", "Fallacy Detection", "Structuring Arguments"]
  },
  {
    id: 4,
    category: "Class 9",
    tag: "4 Weeks",
    title: "Ivy League & Oxbridge Admissions",
    description: "Direct insights into what admissions officers look for. We strip away the myths and focus on the data-backed strategies for acceptance.",
    tasks: [
        "Deconstructing the Common App Essay",
        "The UK Personal Statement: Academic Depth vs. Narrative",
        "Extracurricular Strategy: Impact over Quantity",
        "Alumni Panel Q&A: The Reality of Campus Life"
    ],
    tags: ["Personal Statement", "Interview Prep", "Application Strategy"]
  },
  {
    id: 5,
    category: "Class 10",
    tag: "2 Weeks",
    title: "Leadership in the 21st Century",
    description: "Understanding modern leadership challenges, including AI ethics, technological disruption, and managing diverse, remote teams.",
    tasks: [
        "Leadership Styles: Servant vs. Transformational",
        "Ethics in AI and Technology Management",
        "Crisis Management Simulation",
        "Team Building Workshop"
    ],
    tags: ["Tech Ethics", "Modern Leadership", "Team Management"]
  },
  {
    id: 6,
    category: "Class 11",
    tag: "1 Weeks",
    title: "Social Impact Project",
    description: "Students work in teams to design a solution for a real-world problem, pitching their ideas to a panel of verified experts.",
    tasks: [
        "Ideation Workshop: Design Thinking Principles",
        "Project Management 101: Gantt Charts & KPIs",
        "Pitch Deck Creation & Storytelling",
        "Final Presentation to Expert Judges"
    ],
    tags: ["Project Management", "Teamwork", "Presentation Skills"]
  },
  {
    id: 7,
    category: "Class 12",
    tag: "8 Weeks",
    title: "Social Impact Project",
    description: "Students work in teams to design a solution for a real-world problem, pitching their ideas to a panel of verified experts.",
    tasks: [
        "Ideation Workshop: Design Thinking Principles",
        "Project Management 101: Gantt Charts & KPIs",
        "Pitch Deck Creation & Storytelling",
        "Final Presentation to Expert Judges"
    ],
    tags: ["Project Management", "Teamwork", "Presentation Skills"]
  }
];

export const features = [
  {
    icon: <Trophy className="w-8 h-8 text-amber-600" />,
    title: "Admissions Expert",
    description: "Gain inside knowledge from former admissions officers from top US and UK universities."
  },
  {
    icon: <Users className="w-8 h-8 text-amber-600" />,
    title: "Verified Alumni",
    description: "Connect with mentors who have successfully navigated the path to Ivy League and Oxbridge."
  },
  {
    icon: <FileText className="w-8 h-8 text-amber-600" />,
    title: "Application Support",
    description: "Comprehensive reviews of your essays, CVs, and application materials to ensure perfection."
  },
  {
    icon: <Globe className="w-8 h-8 text-amber-600" />,
    title: "Global Network",
    description: "Join an elite community of ambitious students from around the world."
  }
];

export const faqs = [
  { question: "How do I apply for the program?", answer: "Applications are open now. Click the button below to start your journey." },
  { question: "Is financial aid available?", answer: "Yes, we offer merit-based scholarships for outstanding candidates." },
  { question: "What is the time commitment?", answer: "The program requires approximately 5 hours per week over 8 weeks." },
  { question: "Who are the mentors?", answer: "Our mentors are alumni from Harvard, Oxford, Cambridge, and Stanford." },
  { question: "Is this program online?", answer: "Yes, the program is fully remote with live sessions and interactive workshops." }
];