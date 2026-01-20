import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  UserPlus,
  MessageCircle,
  ThumbsUp,
  Share2,
  MessageSquare,
  MoreHorizontal
} from "lucide-react";

// --- IMPORTS FROM MOCK DATA FILES ---
import { mockUsers } from "../../../data/user/User";
import { mockExperience } from "../../../data/user/Experience";
import { mockEducation } from "../../../data/user/Education";
import { mockPosts } from "../../../data/user/Postdata"; // Import the new posts file

const ProfilePublic = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    if (!userId) return;

    const parsedId = parseInt(userId);

    // 1. Find User
    const foundUser = mockUsers.find((u) => u.userId === parsedId);

    // 2. Filter Experience
    const userExperience = mockExperience.filter((exp) => exp.userId === parsedId);

    // 3. Filter Education
    const userEducation = mockEducation.filter((edu) => edu.userId === parsedId);

    // 4. Filter Posts (From the imported file)
    const userPosts = mockPosts.filter((post) => post.userId === parsedId);

    setUser(foundUser || null);
    setExperience(userExperience);
    setEducation(userEducation);
    setPosts(userPosts);
    setLoading(false);
  }, [userId]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">User not found</h2>
        <Link to="/" className="text-blue-600 mt-4 hover:underline">Go Back Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* GRID LAYOUT: Left (3 cols) / Right (2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* --- LEFT SIDE (Profile + Experience + Education) --- */}
          <div className="lg:col-span-1 space-y-6">

            {/* 1. Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div
                className="h-42 bg-gray-300"
                style={{
                  backgroundImage: `url(${user.coverPhoto})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div className="px-5 pb-6">
                <div className="flex flex-col items-start -mt-8">
                  <div className="flex justify-between w-full items-end">
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-18 h-18 rounded-full border-4 border-white object-cover bg-white shadow-md"
                    />
                    <div className="flex gap-2 mb-0">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors">
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Follow</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-full text-sm font-medium transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Message</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                    <p className="text-blue-600 font-medium">{user.designation}</p>
                    <div className="flex items-center mt-1 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{user.address.city}, {user.address.country}</span>
                    </div>
                  </div>
                </div>

                {/* Details/Skills */}
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {user.email}</div>
                    <div className="flex items-center"><Globe className="w-4 h-4 mr-2" /> @{user.username}</div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium border border-gray-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Experience Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </span>
                Experience
              </h3>

              {experience.length > 0 ? (
                <div className="space-y-8">
                  {experience.map((exp) => (
                    <div key={exp.experienceId} className="flex gap-4 relative group">
                      <div className="absolute left-[5px] top-10 bottom-[-30px] w-0.5 bg-gray-200 group-last:hidden"></div>
                      <div className="w-3 h-3 mt-1.5 rounded-full bg-blue-500 flex-shrink-0 z-10"></div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{exp.position}</h4>
                        <div className="text-blue-600 font-medium">{exp.company}</div>
                        <div className="text-sm text-gray-500 mt-1 mb-2 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {exp.startDate} - {exp.endDate ? exp.endDate : "Present"}
                        </div>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-3">
                          {exp.responsibilities.map((res, idx) => (
                            <li key={idx}>{res}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No experience added.</p>
              )}
            </div>

            {/* 3. Education Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </span>
                Education
              </h3>

              {education.length > 0 ? (
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.educationId} className="flex gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 text-green-600">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{edu.institution}</h4>
                        <div className="text-gray-800 font-medium text-sm">{edu.degree}</div>
                        <div className="text-sm text-gray-600">{edu.fieldOfStudy}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {edu.startYear} - {edu.endYear}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No education added.</p>
              )}
            </div>
          </div>

          {/* --- RIGHT SIDE (Posts) --- */}
          <div className="lg:col-span-2 space-y-6">

            {/* Posts Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Activity</h3>
              <span className="text-sm text-gray-500">{posts.length} posts</span>
            </div>

            {/* Post List */}
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.postId} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">

                  {/* Post User Info */}
                  <div className="flex items-center mb-4">
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{user.name}</h4>
                      <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Post Content Text */}
                  <h5 className="font-bold text-gray-900 mb-2">{post.title}</h5>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* --- POST IMAGE (Rendered only if exists) --- */}
                  {post.image && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-gray-100">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-auto object-cover max-h-[300px]"
                      />
                    </div>
                  )}

                  {/* Post Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-gray-500">
                    <button className="flex items-center space-x-1.5 hover:text-blue-600 transition-colors text-sm">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1.5 hover:text-blue-600 transition-colors text-sm">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </button>
                    <button className="flex items-center space-x-1.5 hover:text-blue-600 transition-colors text-sm">
                      <Share2 className="w-4 h-4" />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No recent activity to show.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePublic;