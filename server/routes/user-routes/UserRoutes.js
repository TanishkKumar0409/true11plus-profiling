import express from "express"
import { registerUser } from "../../controllers/user-controllers/UserController.js";
import { verifyEmail } from "../../controllers/auth/VerifyEmailController.js";

const router = express.Router();

router.post("/auth/register", registerUser);
router.get("/verify-email", verifyEmail);


export default router;
