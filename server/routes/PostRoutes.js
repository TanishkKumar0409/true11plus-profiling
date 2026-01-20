import express from "express"
import { createPost, deletePost, editPost, getPostByPostId, getPostByUserId } from "../controllers/post-controller/PostController.js";
import { upload } from "../utils/Multer.js";
import { processImage } from "../utils/ImageProcess.js";
import { getAllPostLikeCountsByUserId, getPostLikeByPostId, getUserAllPostLikes, togglePostLike } from "../controllers/post-controller/PostLikeController.js";
import { addPostComment, deleteCommentWithChildren, getCommentsByPostId, toggleCommentLike } from "../controllers/post-controller/PostCommentController.js";

const postRouter = express.Router();

const postUpload = upload.fields([{ name: "images", maxCount: 5 }]);
postRouter.post(`/user/create/post`, postUpload, processImage, createPost)
postRouter.get(`/user/post/:userId`, getPostByUserId)
postRouter.get(`/posts/:post_id`, getPostByPostId)
postRouter.delete(`/user/delete/post/:objectId`, deletePost)
postRouter.patch("/user/edit/post/:objectId", postUpload, processImage, editPost);

postRouter.post("/user/post/like/:postId", togglePostLike)
postRouter.get("/user/all/post/like/:userId", getUserAllPostLikes)
postRouter.get("/user/post/like/:post_id", getPostLikeByPostId)
postRouter.get("/user/post/like-count/:userId", getAllPostLikeCountsByUserId)

postRouter.post("/user/post/add/comment", addPostComment)
postRouter.delete("/user/post/delete/comment/:commentId", deleteCommentWithChildren)
postRouter.post("/user/post/add/comment/like/:commentId", toggleCommentLike)
postRouter.get("/user/post/comment/:postId", getCommentsByPostId)

export default postRouter