import express from "express";
import {
  GetEmailVerification,
  GetUserByEmail,
  getAuthToken,
  Login,
  registerUser,
  VerifyUserEmail,
  AuthUserDetails,
  AuthLogout,
  UserForgotPassword,
  getUserResetToken,
  UserPostResetToken,
} from "../controllers/user-controller/AuthController.js";
import {
  DeleteUserAvatar,
  DeleteUserBanner,
  getAllUsers,
  getRandomUsersWithDetails,
  getRandomStudentsWithDetailsLimit,
  getUserByObjectId,
  getUserBysRole,
  getUserByUsername,
  UpdateProfileLocation,
  UpdateUserDetails,
  UpdateUserDetailsByAdmin,
  UpdateUserLocation,
  UserAvatarChange,
  UserBannerChange,
} from "../controllers/user-controller/UserController.js";
import {
  createPermissions,
  getAllPermissions,
  getAllroles,
  updateUserPermissions,
} from "../controllers/user-controller/RolesAndPermissionDoc.js";
import { upload } from "../utils/Multer.js";
import { processImage } from "../utils/ImageProcess.js";
import {
  createUserExperience,
  deleteExperiece,
  getExperienceByUserId,
} from "../controllers/user-controller/ExperienceController.js";
import {
  deleteEducation,
  getEducationByUserId,
  upsertUserEducation,
} from "../controllers/user-controller/EducationController.js";
import {
  addUserSkill,
  deleteUserSkill,
  getSkillsByUserId,
} from "../controllers/user-controller/SkillController.js";
import {
  addUserLanguage,
  deleteUserLanguage,
  getUserLanguages,
} from "../controllers/user-controller/UserLanguageController.js";
import {
  addOrUpdateUserSocialLinks,
  getUserSocialLinksByUserId,
} from "../controllers/user-controller/UserSocialLinksController.js";

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", Login);
router.get("/auth/verify-email/:token", GetEmailVerification);
router.post(`/auth/verify-email/email/:email`, VerifyUserEmail);
router.get(`/auth/token`, getAuthToken);
router.get(`/auth/user`, AuthUserDetails);
router.get(`/auth/logout`, AuthLogout);
router.post(`/auth/forgot-password`, UserForgotPassword);
router.get("/auth/reset/:token", getUserResetToken);
router.post("/auth/reset", UserPostResetToken);
router.get("/auth/user/email/:email", GetUserByEmail);

router.get(`/roles`, getAllroles);

router.post(`/create/permissions`, createPermissions);
router.get(`/permissions`, getAllPermissions);
router.patch(`/user/:objectId/permissions`, updateUserPermissions);

const avatarUpload = upload.fields([{ name: "avatar", maxCount: 1 }]);
const bannerUpload = upload.fields([{ name: "banner", maxCount: 1 }]);
router.patch(
  "/user/avatar/:userId",
  avatarUpload,
  processImage,
  UserAvatarChange,
);
router.get(`/users`, getAllUsers);
router.get(`/users/role/:role`, getUserBysRole);
router.delete(`/user/avatar/:userId`, DeleteUserAvatar);
router.get(`/user/username/:username`, getUserByUsername);
router.get(`/user/:objectId`, getUserByObjectId);
router.get(`/user/random/students`, getRandomStudentsWithDetailsLimit);
router.get(`/user/random/:userId`, getRandomUsersWithDetails);
router.patch(`/user/admin/update/:objectId`, UpdateUserDetailsByAdmin);
router.patch(`/user/location/update/:userId`, UpdateProfileLocation);
router.patch(
  "/user/banner/:userId",
  bannerUpload,
  processImage,
  UserBannerChange,
);
router.delete(`/user/banner/:userId`, DeleteUserBanner);
router.patch(`/user/:userId`, UpdateUserDetails);
router.patch(`/user/update/location`, UpdateUserLocation);

router.patch(`/user/add/experience`, createUserExperience);
router.delete(`/user/delete/experience/:objectId`, deleteExperiece);
router.get(`/user/experience/:userId`, getExperienceByUserId);

router.patch(`/user/add/education`, upsertUserEducation);
router.delete(`/user/delete/education/:objectId`, deleteEducation);
router.get(`/user/education/:userId`, getEducationByUserId);

router.post("/user/add/skill", addUserSkill);
router.get("/user/skills/:userId", getSkillsByUserId);
router.delete("/user/delete/skill/:objectId", deleteUserSkill);

router.post("/user/add/language", addUserLanguage);
router.delete("/user/delete/language/:objectId", deleteUserLanguage);
router.get("/user/language/:userId", getUserLanguages);

router.post("/user/add/social-links", addOrUpdateUserSocialLinks);
router.get("/user/social-links/:userId", getUserSocialLinksByUserId);

export default router;
