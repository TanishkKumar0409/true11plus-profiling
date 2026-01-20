// src/components/student/ActivityLogsTab.tsx
import React from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import {type ActivityFeedPost } from '../../../../types';

interface Props {
  posts: ActivityFeedPost[];
}

const ActivityLogsTab: React.FC<Props> = ({ posts }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Activity Feed</h2>
      
      <div className="space-y-8">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
        
        {posts.length === 0 && (
          <p className="text-slate-500 text-center py-8">No activity posts yet.</p>
        )}
      </div>
    </div>
  );
};

// Helper Component for a Single Post
const PostItem: React.FC<{ post: ActivityFeedPost }> = ({ post }) => (
  <div className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
    {/* Header: Author & Time */}
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold shadow-sm">
        {post.authorInitials}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm">{post.authorName}</h4>
        <p className="text-slate-500 text-xs">{post.timestamp}</p>
      </div>
    </div>

    {/* Content */}
    <p className="text-slate-700 mb-4 leading-relaxed">{post.content}</p>

    {/* Optional Image */}
    {post.image && (
      <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        <img src={post.image} alt="Post content" className="w-full h-auto object-cover" />
      </div>
    )}

    {/* Actions: Like, Comment, Share */}
    <div className="flex items-center gap-6 text-slate-500 text-sm font-medium">
      <button className="flex items-center gap-2 hover:text-pink-600 transition-colors">
        <Heart className="w-5 h-5" />
        <span>{post.likes}</span>
      </button>
      <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
        <MessageSquare className="w-5 h-5" />
        <span>{post.comments}</span>
      </button>
      <button className="flex items-center gap-2 hover:text-slate-900 transition-colors">
        <Share2 className="w-5 h-5" />
        <span>{post.shares}</span>
      </button>
    </div>
  </div>
);

export default ActivityLogsTab;