import { useEffect, useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Globe,
  Mail,
  Linkedin,
  Github,
  Twitter,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Share2,
  Image as ImageIcon,
  X
} from "lucide-react";

// --- IMPORTS FROM MOCK DATA ---
import { mockUsers } from "../../../data/user/User";
import { mockExperience } from "../../../data/user/Experience";
import { mockEducation } from "../../../data/user/Education";
import { mockPosts } from "../../../data/user/Postdata";

function PostProfile() {
  const { userId } = useParams(); // Get ID from URL

  // State
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Post Form State
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [newPostImageFile, setNewPostImageFile] = useState<File | null>(null);
  const [newPostImagePreview, setNewPostImagePreview] = useState<string | null>(null);

  // --- 1. FETCH DATA BASED ON URL ID ---
  useEffect(() => {
    if (!userId) return;
    const parsedId = parseInt(userId);

    // Find User
    const foundUser = mockUsers.find((u) => u.userId === parsedId);

    // Filter User's specific data
    const userPosts = mockPosts.filter((p) => p.userId === parsedId);
    const userExp = mockExperience.filter((e) => e.userId === parsedId);
    const userEdu = mockEducation.filter((e) => e.userId === parsedId);

    if (foundUser) {
      setUser(foundUser);
      // Sort posts by newest first (optional)
      setPosts(userPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setExperience(userExp);
      setEducation(userEdu);
    }

    setLoading(false);
  }, [userId]);

  // --- IMAGE PREVIEW LOGIC ---
  useEffect(() => {
    if (!newPostImageFile) {
      setNewPostImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(newPostImageFile);
    setNewPostImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [newPostImageFile]);

  // --- HANDLERS ---

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = (now.getTime() - past.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) setNewPostImageFile(file);
  };

  const handleRemoveSelectedImage = () => {
    setNewPostImageFile(null);
    setNewPostImagePreview(null);
  };

  const handleCreatePost = () => {
    if (newPost.trim().length === 0 && !newPostImageFile) return;

    const newPostObj = {
      postId: `new-${Date.now()}`,
      userId: user.userId,
      title: "New Update", // Default title for quick posts
      author: user.name, // Augmenting mock structure for local display
      authorAvatar: user.profilePicture,
      createdAt: new Date().toISOString(),
      content: newPost,
      likes: 0,
      shares: 0,
      commentsCount: 0,
      liked: false,
      image: newPostImagePreview || null,
    };

    setPosts((prev) => [newPostObj, ...prev]);

    // Reset Form
    setNewPost("");
    setShowNewPostForm(false);
    setNewPostImageFile(null);
    setNewPostImagePreview(null);
  };

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.postId === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  // --- RENDER ---

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;
  if (!user) return <div className="p-10 text-center">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* === LEFT COLUMN: PROFILE INFO === */}
          <div className="lg:col-span-1 space-y-4">

            {/* Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div
                className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"
                style={{
                  backgroundImage: `url(${user.coverPhoto})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="px-4 pb-4">
                <div className="flex flex-col items-center -mt-12">
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white"
                  />
                  <h3 className="mt-2 text-lg font-bold text-gray-900 text-center">
                    {user.name}
                  </h3>
                  <p className="text-sm text-blue-600 text-center font-medium">
                    {user.designation}
                  </p>
                  <div className="flex items-center mt-2 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.address.city}, {user.address.country}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm px-4">
                  <div className="text-center">
                    <span className="block font-bold text-gray-900">{user.followers}</span>
                    <span className="text-gray-500">Followers</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-gray-900">{posts.length}</span>
                    <span className="text-gray-500">Posts</span>
                  </div>
                </div>

                {/* Social Links (Mocking these since they aren't in your data file yet) */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center space-x-4">
                  <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-700 cursor-pointer" />
                  <Github className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer" />
                  <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Contact Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3" />
                  <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline truncate">
                    {user.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-3" />
                  <span className="text-blue-600 cursor-pointer">www.{user.username}.com</span>
                </div>
              </div>
            </div>

            {/* Experience Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Experience</h3>
              {experience.length > 0 ? (
                <div className="space-y-4">
                  {experience.slice(0, 2).map(exp => (
                    <div key={exp.experienceId} className="flex gap-3">
                      <div className="mt-1"><Calendar className="w-4 h-4 text-gray-400" /></div>
                      <div>
                        <div className="text-sm font-semibold">{exp.position}</div>
                        <div className="text-xs text-gray-500">{exp.company}</div>
                      </div>
                    </div>
                  ))}
                  {experience.length > 2 && <div className="text-xs text-blue-600">View more...</div>}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No experience listed.</div>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* === RIGHT COLUMN: ACTIVITY FEED === */}
          <div className="lg:col-span-2 space-y-4">

            {/* Create Post Widget */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              {!showNewPostForm ? (
                <div className="flex items-center space-x-3">
                  <img src={user.profilePicture} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <button
                    onClick={() => setShowNewPostForm(true)}
                    className="flex-1 text-left px-4 py-3 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200"
                  >
                    Start a post, {user.name.split(' ')[0]}...
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold text-gray-700">Create Post</h4>
                    <button onClick={() => setShowNewPostForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                  </div>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What do you want to talk about?"
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 bg-white min-h-[100px]"
                  />

                  {/* Image Preview Area */}
                  {newPostImagePreview && (
                    <div className="mt-3 relative inline-block">
                      <img src={newPostImagePreview} alt="Preview" className="h-32 rounded-lg border border-gray-200" />
                      <button
                        onClick={handleRemoveSelectedImage}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <label className="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-blue-600 transition-colors">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Media</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>

                    <button
                      onClick={handleCreatePost}
                      disabled={!newPost.trim() && !newPostImageFile}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.postId} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{user.name}</h4>
                          <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)} • {post.visibility}</p>
                        </div>
                      </div>
                      <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
                    </div>

                    <h5 className="font-bold text-gray-900 mb-2 text-md">{post.title}</h5>
                    <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>


                    {post.image && (
                      <div className="mb-4 -mx-5">
                        <img src={post.image} alt="Post" className="w-full h-auto object-cover max-h-[400px]" />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-gray-500">
                      <button
                        onClick={() => handleLike(post.postId)}
                        className={`flex items-center space-x-1.5 text-sm hover:bg-gray-100 px-2 py-1 rounded transition ${post.liked ? 'text-blue-600' : ''}`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1.5 text-sm hover:bg-gray-100 px-2 py-1 rounded transition">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount}</span>
                      </button>
                      <button className="flex items-center space-x-1.5 text-sm hover:bg-gray-100 px-2 py-1 rounded transition">
                        <Share2 className="w-4 h-4" />
                        <span>{post.shares}</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500">No activity yet.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default PostProfile;