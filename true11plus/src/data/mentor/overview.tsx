import { TrendingUp, Target, Award, Calendar } from 'lucide-react';

export const overviewStats = [
  { label: 'Students', value: '6', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Subjects', value: '3', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Scholarships', value: '2', icon: Award, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Deadlines', value: '3', icon: Calendar, color: 'text-red-600', bg: 'bg-red-50' },
];

export const deadlineData = [
  { id: 1, title: "University", type: "Application", date: "January 15, 2025" },
  { id: 2, title: "MIT", type: "Application", date: "January 1, 2025" },
  { id: 3, title: "University of Toronto", type: "Scholarship", date: "February 1, 2025" },
];

export const topMatchesData = [
  {
    id: 1, name: "UIT", matchLabel: "75% Match", matchScore: "92/100",
    goodMatchReasons: ["Strong Computer Science program", "Excellent research opportunities"],
    improvementTips: ["Improve SAT score to 1500+", "Complete calculus course"]
  },
  {
    id: 2, name: "MIT", matchLabel: "65% Match", matchScore: "88/100",
    goodMatchReasons: ["Top engineering programs", "Innovation focus"],
    improvementTips: ["Maintain GPA above 3.8", "Complete physics courses"]
  }
];

export const universityData = [
  {
    id: 1, name: "MIT", chance: "65%", match: "88/100",
    goodMatchReasons: ["Top engineering programs", "Innovation focus", "Strong alumni network"],
    improvementTips: ["Maintain GPA above 3.8", "Complete physics courses", "Participate in science competitions"]
  },
  {
    id: 2, name: "University of Toronto", chance: "85%", match: "90/100",
    goodMatchReasons: ["Affordable tuition", "Diverse programs", "International recognition"],
    improvementTips: ["Submit English proficiency test", "Complete application essays", "Provide recommendation letters"]
  },
  {
    id: 3, name: "Stanford University", chance: "75%", match: "92/100",
    goodMatchReasons: ["Strong Computer Science program", "Excellent research opportunities", "Good financial aid"],
    improvementTips: ["Improve SAT score to 1500+", "Complete calculus course", "Add leadership experience"]
  }
];

export const scholarshipData = [
  {
    id: 1, title: "Merit Scholarship", university: "Stanford University", amount: "$25,000", status: "Eligible", deadline: "March 1, 2025",
    requirements: ["GPA above 3.5", "Leadership experience"]
  },
  {
    id: 2, title: "International Student Aid", university: "University of Toronto", amount: "$15,000", status: "Eligible", deadline: "February 15, 2025",
    requirements: ["Financial need demonstration", "Academic excellence"]
  }
];