import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Globe,
  Mail,
  Linkedin,
  Github,
  Twitter,
  Edit3,
  Plus,
  GraduationCap,
  UserPlus,
  CheckCircle,
  Briefcase,
  Calendar,
} from "lucide-react";

// Import your mock data
import { mockUsers } from "../../../data/user/User";
import { mockExperience } from "../../../data/user/Experience";
import { mockEducation } from "../../../data/user/Education";

// --- Types ---
interface UserAddress {
  city: string;
  state: string;
  country: string;
}

interface User {
  userId: number;
  name: string;
  email: string;
  username: string;
  role: string;
  address: UserAddress;
  designation: string;
  followers: number;
  skills: string[];
  languages: string[];
  about?: string;
  coverPhoto?: string;
  profilePicture?: string;
}

function ProfileDetails() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback images
  const defaultCover =
    "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=400&dpr=1";

  useEffect(() => {
    // Scroll to top when userId changes (when clicking a suggestion)
    window.scrollTo(0, 0);

    if (userId) {
      const foundUser = mockUsers.find((u) => u.userId === parseInt(userId));
      setUser(foundUser || null);
    } else {
      setUser(mockUsers[0]);
    }
    setLoading(false);
  }, [userId]);

  // --- LOGIC: Filter Data by User ID ---
  const userExperience = user
    ? mockExperience.filter((exp) => exp.userId === user.userId)
    : [];

  const userEducation = user
    ? mockEducation.filter((edu) => edu.userId === user.userId)
    : [];

  // Exclude current user from suggestions
  const suggestions = user
    ? mockUsers.filter((u) => u.userId !== user.userId).slice(0, 5)
    : [];

  // Helper to format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;
  if (!user) return <div className="p-10 text-center">User not found.</div>;

  return (
    <div className="min-h-screen bg-[var(--bg-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar (Profile Info) */}
          <div className="lg:col-span-2 space-y-4">

            {/* --- PROFILE HEADER CARD --- */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div
                className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative"
                style={{
                  backgroundImage: `url(${user.coverPhoto || defaultCover})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>

              <div className="p-6 relative">
                <div className="flex flex-col items-start -mt-20 mb-4">
                  <img
                    src={
                      user.profilePicture ||
                      `https://ui-avatars.com/api/?name=${user.name}&background=random&size=150`
                    }
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md bg-white"
                  />

                  <div className="mt-4 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-gray-600 font-medium">
                          {user.designation}
                        </p>
                        <p className="text-sm text-gray-500">@{user.username}</p>

                        <div className="flex items-center mt-2 text-gray-500 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {user.address.city}, {user.address.state},{" "}
                          {user.address.country}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-blue-700 transition">
                          Connect
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-50 transition">
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex gap-6">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-bold text-lg">
                      {user.followers}
                    </span>
                    <span className="text-gray-500 text-sm">Followers</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-bold text-lg">
                      500+
                    </span>
                    <span className="text-gray-500 text-sm">Connections</span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- ABOUT SECTION --- */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                <Edit3 className="w-4 h-4 text-gray-500 cursor-pointer" />
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {user.about ||
                  `Passionate ${user.designation} based in ${user.address.city}. Experienced in leveraging technology to solve real-world problems. Always eager to learn new skills and connect with like-minded professionals.`}
              </p>
            </div>

            {/* --- EXPERIENCE SECTION --- */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-blue-600">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="text-gray-500 hover:text-blue-600">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {userExperience.length > 0 ? (
                <div className="space-y-8 relative">
                  {userExperience.length > 1 && (
                    <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gray-200 -z-0"></div>
                  )}

                  {userExperience.map((exp) => (
                    <div key={exp.experienceId} className="flex gap-4 relative z-10">
                      <div className="w-10 h-10 bg-white border border-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-gray-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">
                              {exp.position}
                            </h4>
                            <p className="text-sm font-medium text-gray-800">
                              {exp.company} · {exp.employmentType}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {exp.location}
                          </span>
                        </div>

                        <div className="mt-3 text-sm text-gray-700">
                          <ul className="list-disc list-inside space-y-1">
                            {exp.responsibilities.map((res, idx) => (
                              <li key={idx}>{res}</li>
                            ))}
                          </ul>
                        </div>

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {exp.technologies.map((tech, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-100">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 italic">
                  <Briefcase className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  No experience listed yet.
                </div>
              )}
            </div>

            {/* --- EDUCATION SECTION --- */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-blue-600">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="text-gray-500 hover:text-blue-600">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {userEducation.length > 0 ? (
                <div className="space-y-6">
                  {userEducation.map((edu) => (
                    <div key={edu.educationId} className="flex gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-gray-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-base">
                          {edu.institution}
                        </h4>
                        <p className="text-gray-800 text-sm font-medium">
                          {edu.degree}, {edu.fieldOfStudy}
                        </p>

                        <p className="text-sm text-gray-500 mt-0.5">
                          {edu.startYear} - {edu.endYear}
                          {edu.grade && <span className="ml-2">• Grade: {edu.grade}</span>}
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                          {edu.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 italic">
                  <GraduationCap className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  No education listed yet.
                </div>
              )}
            </div>

            {/* --- SKILLS & LANGUAGES --- */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                <Plus className="w-4 h-4 text-gray-500 cursor-pointer" />
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {user.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4 border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
                <Plus className="w-4 h-4 text-gray-500 cursor-pointer" />
              </div>
              <div className="space-y-2">
                {user.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{lang}</span>
                    <span className="text-gray-500">Native or Bilingual</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* --- Right Sidebar (Connect People) --- */}
          <div className="lg:col-span-1 space-y-4">
            {/* Activity Block */}
            <div className="flex items-center justify-between mb-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h4>
                <p className="text-xs text-gray-500">2 new posts this week</p>
              </div>
              <Link
                to={`/user/profile-post/${user.userId}`}  // Note the { ` ` } structure
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm font-medium"
              >
                Create Post
              </Link>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="font-semibold text-md text-gray-900">
                People you may know
              </h4>
              <p className="text-gray-500 text-sm mb-4">
                Based on your skills
              </p>

              <div className="space-y-4">
                {suggestions.map((person) => (
                  <div
                    key={person.userId}
                    className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start space-x-3">

                      {/* 1. WRAP IMAGE IN LINK TO PUBLIC PROFILE */}
                      <Link to={`/user/profile-public/${person.userId}`} className="flex-shrink-0">
                        <img
                          src={
                            person.profilePicture ||
                            `https://ui-avatars.com/api/?name=${person.name}&background=random&size=150`
                          }
                          alt={person.name}
                          className="w-10 h-10 rounded-full object-cover shadow-sm"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">

                          {/* 2. LINK NAME TO PUBLIC PROFILE */}
                          <h4 className="text-sm font-semibold text-gray-900 truncate hover:underline cursor-pointer">
                            <Link to={`/user/profile-public/${person.userId}`}>
                              {person.name}
                            </Link>
                          </h4>

                          {person.userId % 2 === 0 && (
                            <CheckCircle className="w-3 h-3 text-blue-500 fill-current" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {person.designation}
                        </p>

                        <button className="mt-2 flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                          <UserPlus className="w-3 h-3" />
                          <span>Connect</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info (Sidebar bottom) */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-3">Contact Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3" />
                  <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                    {user.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-3" />
                  <a href="#" className="text-blue-600 hover:underline">
                    www.{user.username}.com
                  </a>
                </div>
                <div className="flex gap-4 mt-2 pl-7">
                  <Linkedin className="w-5 h-5 text-blue-700 cursor-pointer" />
                  <Github className="w-5 h-5 text-gray-800 cursor-pointer" />
                  <Twitter className="w-5 h-5 text-blue-400 cursor-pointer" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;