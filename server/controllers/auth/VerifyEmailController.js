import jwt from "jsonwebtoken";
import User from "../../models/user-models/UserModel.js";

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Verification token missing" });
    }

    // 1️⃣ Decode token
    const decoded = jwt.verify(token, process.env.EMAIL_VERIFY_SECRET);

    // 2️⃣ Find user with token + expiry
    const user = await User.findOne({
      _id: decoded.userId,
      verifytoken: token,
      verifytokenexpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Token expired or invalid",
      });
    }

    // Already verified
    if (user.verfied) {
      return res.status(200).json({
        message: "Email already verified",
      });
    }

    // 3️⃣ Verify
    user.verfied = true;
    user.verifytoken = null;
    user.verifytokenexpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully ✅",
    });

  } catch (error) {
    return res.status(400).json({
      error: "Invalid or expired verification token",
    });
  }
};
