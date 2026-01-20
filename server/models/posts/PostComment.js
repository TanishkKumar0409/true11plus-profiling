import { Schema } from 'mongoose';
import { MainDatabase } from '../../database/Databases.js';

const CommentSchema = new Schema(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: 'post-comment',
            default: null
        },
        replyCount: { type: Number, default: 0 },
        likedBy: { type: [Schema.Types.ObjectId] },
    },
    { timestamps: true }
);

export const Comment = MainDatabase.model('post-comment', CommentSchema);