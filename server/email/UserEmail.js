import path from "node:path";
import { MailTransporter } from "../utils/MailTransporter.js";
import User from "../models/user-models/UserModel.js";
import { createJwtToken } from "../utils/Callbacks.js";
import ejs from "ejs";

export const sendUserEmailVerification = async (req, user) => {
  try {
    const token = await createJwtToken({ userId: user?._id }, "5m");

    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    const saveVerifyToken = await User.findByIdAndUpdate(user._id, {
      verifytoken: token,
      verifytokenexpiry: expiryTime,
    });

    if (!saveVerifyToken) return { error: "User not found." };

    const origin = req?.headers?.origin || process.env.FRONTEND_URL;
    if (!origin) throw new Error("Origin not found");

    const verifyUrl = `${origin}/auth/verify-email/confirm/${token}`;

    const templatePath = path.resolve(
      "mail-templates",
      "VerifyEmailTemplate.ejs"
    );
    const html = await ejs.renderFile(templatePath, {
      verifyUrl,
      user,
    });

    await MailTransporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Verify Your Email",
      html: html,
    });

    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
};

export const sendUserResetEmail = async (user, req) => {
  try {
    const token = await createJwtToken({ userId: user?._id }, "5m");

    const userInfo = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          resetToken: token,
          resetTokenExpiry: new Date(Date.now() + 5 * 60 * 1000),
        },
      },
      { new: true }
    );

    const origin = req?.headers?.origin || process.env.FRONTEND_URL;
    if (!origin) throw new Error("Origin not found");
    const resetUrl = `${origin}/auth/reset-password/confirm/${token}`;

    const templatePath = path.resolve("mail-templates", "ResetPassword.ejs");

    const html = await ejs.renderFile(templatePath, {
      resetUrl,
      user: userInfo,
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset Request",
      html: html,
    };

    await MailTransporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending password reset email:", error);
  }
};
