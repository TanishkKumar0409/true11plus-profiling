import User from "../../models/user-models/UserModel.js";
import {
  sendUserResetEmail,
  sendUserEmailVerification,
} from "../../email/UserEmail.js";
import {
  createJwtToken,
  DecodeJwtToken,
  normalizePhone,
} from "../../utils/Callbacks.js";
import UserRoles from "../../models/user-models/Roles.js";
import UserPermissions from "../../models/user-models/Permissions.js";
import { getToken, removeToken } from "../../utils/getDataFromToken.js";
import UserLocation from "../../models/user-models/UserLocation.js";
import UserAssets from "../../models/user-models/UserAssets.js";

export const registerUser = async (req, res) => {
  try {
    let { username, name, email, mobile_no, password, confirm_password, role } =
      req.body;
    role = "student";

    if (
      !username ||
      !name ||
      !email ||
      !mobile_no ||
      !password ||
      !confirm_password
    ) {
      return res.status(400).json({ error: "Required Field is Missing." });
    }

    if (password !== confirm_password)
      return res.status(400).json({ error: "Passwords do not match." });

    username = username.toLowerCase().trim();
    const normalizedMobile = normalizePhone(mobile_no);

    if (await User.findOne({ username }))
      return res.status(400).json({ error: "username already exists" });

    if (await User.findOne({ email }))
      return res.status(400).json({ error: "email already exists" });

    if (await User.findOne({ mobile_no: normalizedMobile }))
      return res.status(400).json({ error: "mobile number already exists" });

    let roleDoc = await UserRoles.findOne({ role });
    if (!roleDoc)
      return res.status(400).json({ error: "Invalid Role Provided" });

    let permissions = [];
    const PropertyPermissions = await UserPermissions.findOne({
      roles: roleDoc?._id,
    });
    if (PropertyPermissions)
      permissions = PropertyPermissions.permissions.map((item) => item._id);

    const newUser = new User({
      username,
      name,
      email,
      mobile_no,
      password,
      role: roleDoc?._id,
      permissions,
    });

    await newUser.save();

    await sendUserEmailVerification(req, newUser);

    return res.status(201).json({
      message:
        "You are registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const GetEmailVerification = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) return res.status(400).json({ error: "Token is required." });
    const user = await User.findOne({ verifytoken: token });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token." });

    if (user.verified)
      return res.status(400).json({ error: "You are already Verified." });

    if (!user.verifytokenexpiry || user.verifytokenexpiry < Date.now()) {
      await sendUserEmailVerification(req, user);
      return res.status(400).json({
        error: "Token has expired and another verification email has been sent",
      });
    }

    const verifiedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { verified: true },
        $unset: { verifytoken: "", verifytokenexpiry: "" },
      }
    );

    if (!verifiedUser)
      return res.status(500).json({ error: "Failed to verify email." });

    return res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const VerifyUserEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ error: "User not found. Please check your email." });

    if (user.verified)
      return res.status(400).json({ error: "You are already Verified." });

    await sendUserEmailVerification(req, user);

    return res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ error: "User does not exist!" });

    if (user.status === "Suspended") {
      return res
        .status(400)
        .json({ error: "Sorry Your Are Blocked. Please Support." });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch)
      return res.status(401).json({ error: "Incorrect password!" });

    if (!user?.verified) {
      await sendUserEmailVerification({ userId: user._id, email });
      return res.status(403).json({
        error: "Email not verified. Verification email sent.",
        flag: "UnVerified",
      });
    }

    const accessToken = await createJwtToken({ id: user._id, email });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 24 * 60 * 60 * 1000 * 365,
    });

    return res.status(200).json({ message: "Logged in successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const users = await User.findOne({ email });
    if (!users) {
      return res.status(404).json({ error: "Users Not Found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAuthToken = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Please log in." });
    }

    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const AuthUserDetails = async (req, res) => {
  try {
    const token = await getToken(req);
    if (!token) {
      return res.status(401).json({ error: "Access Denied" });
    }

    const decoded = await DecodeJwtToken(token);
    const userDoc = await User.findById(decoded.id);

    if (!userDoc) {
      await removeToken(res);
      return res.status(404).json({ error: "User not found" });
    }
    if (userDoc.status === "Suspended" || !userDoc?.verified) {
      await removeToken(res);
      return res.status(404).json({ error: "Sorry You Are Blocked" });
    }

    const user = userDoc.toObject();

    const location = await UserLocation.findOne({
      userId: user?._id,
    }).lean();
    const userassets = await UserAssets.findOne({ userId: user?._id });

    const finalData = {
      ...user,
      ...(location && {
        address: location.address,
        pincode: location.pincode,
        city: location.city,
        state: location.state,
        country: location.country,
      }),
      ...(userassets && {
        avatar: userassets?.avatar,
        banner: userassets?.banner,
        website: userassets?.website,
      }),
    };

    return res.status(200).json(finalData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const AuthLogout = async (req, res) => {
  try {
    await removeToken(res);
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UserForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    await sendUserResetEmail(user, req);

    return res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: "Token is required." });
    }

    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(404).json({ error: "Invalid token." });
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
      return res
        .status(400)
        .json({ error: "Token has be expired. Please Try again" });
    }

    return res.status(200).json({ message: "Valid token", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UserPostResetToken = async (req, res) => {
  try {
    const { new_password, confirm_password, token } = req.body;

    if (!new_password || !confirm_password || !token)
      return res.status(400).json({ error: "All fields are required." });

    if (new_password !== confirm_password)
      return res.status(400).json({ error: "Passwords do not match." });

    const decodedToken = DecodeJwtToken(token);

    if (decodedToken?.expired)
      return res
        .status(401)
        .json({ error: "Reset link has expired. Try again." });

    const userId = decodedToken?.userId;

    const tokenUser = await User.findOne({
      resetToken: token,
      _id: userId,
    }).select("+password");

    if (!tokenUser) return res.status(404).json({ error: "Invalid token." });

    if (tokenUser.resetTokenExpiry < Date.now())
      return res.status(400).json({ error: "Reset token expired." });

    tokenUser.password = new_password;
    tokenUser.resetToken = undefined;
    tokenUser.resetTokenExpiry = undefined;

    await tokenUser.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
