import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import axios from "axios";
import UserRoles from "../../models/user-models/Roles.js";
import UserAssets from "../../models/user-models/UserAssets.js";
import User from "../../models/user-models/UserModel.js";

const client = new OAuth2Client(process.env.GOOGLE_ID);

const getInitials = (fullName) => {
  const parts = fullName
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(" ")
    .filter(Boolean);

  let initials = parts.map((n) => n[0]).join("");
  return initials.slice(0, 2);
};

const generateRandomNumber = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const generateUniqueUsername = async (name) => {
  let base, username, exists;

  do {
    base = getInitials(name) + generateRandomNumber();
    username = base.toLowerCase();
    exists = await User.findOne({ username });
  } while (exists);

  return username;
};

export const GoogleAuthLogin = async (req, res) => {
  const { token } = req.body;

  try {
    let payload;

    if (token.split(".").length === 3) {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID,
      });
      payload = ticket.getPayload();
    } else {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      payload = data;
    }

    const { name, email, picture } = payload;

    let existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser?.is_google_login) {
        if (!existingUser?.verified) {
          return res.status(403).json({
            error: "Your account is not verified. Please contact support.",
          });
        }

        if (existingUser?.status === "Suspended") {
          return res.status(403).json({
            error: "Your account has been suspended. Please contact support.",
          });
        }

        const accessToken = jwt.sign(
          { id: existingUser._id, email: existingUser.email },
          process.env.JWT_SECRET_VALUE,
        );

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
          message: "Login success",
          user: existingUser,
          is_google_login: true,
        });
      } else {
        return res.status(400).json({
          error: "This email is already registered with Login with Email.",
        });
      }
    }

    const username = await generateUniqueUsername(name);

    let roleDoc = await UserRoles.findOne({ role: "student" });
    if (!roleDoc) {
      return res.status(400).json({ error: "Role 'student' not found" });
    }

    let permissions = [];

    const newUser = new User({
      name,
      email,
      is_google_login: true,
      verified: true,
      status: "active",
      username,
      role: roleDoc._id,
      permissions,
    });
    const savedUser = await newUser.save();

    const userimage = UserAssets({ userId: savedUser._id, avatar: [picture] });
    await userimage.save();

    const accessToken = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET_VALUE,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User created and login success",
      user: savedUser,
      is_google_login: true,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Internal Sever Error" });
  }
};
