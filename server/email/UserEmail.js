import { MailTransporter } from "../utils/MailTransporter.js";
import { generateEmailVerifyToken } from "../utils/GenerateEmailVerifyToken.js";
import { verifyEmailTemplate } from "../mail-templates/VerifyEmailTemplate.js";
import User from "../models/user-models/UserModel.js";

export const UserEmailVerify = async (user) => {
  try {
    const token = generateEmailVerifyToken(user._id);

    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      verifytoken: token,
      verifytokenexpiry: expiryTime,
    });

    if (!process.env.FRONT_URL) {
      throw new Error("FRONT_URL missing in .env");
    }

    const verifyUrl = `${process.env.FRONT_URL}/verify-email/${token}`;

    const htmlContent = verifyEmailTemplate({
      name: user.name,
      verifyUrl,
    });

    await MailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify Your Email (Valid for 5 Minutes)",
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
};
