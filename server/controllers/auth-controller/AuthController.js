import User from "../../models/user-models/UserModel.js";
import { UserEmailVerify } from "../../email/UserEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { username, name, email, contact, password } = req.body;

    // 1️⃣ CHECK DUPLICATES
    if (await User.findOne({ username }))
      return res.status(400).json({ error: "username already exists" });

    if (await User.findOne({ email }))
      return res.status(400).json({ error: "email already exists" });

    if (await User.findOne({ contact }))
      return res.status(400).json({ error: "contact already exists" });

    // 2️⃣ CREATE USER (UNVERIFIED)
    const newUser = new User({
      username: username.toLowerCase(),
      name,
      email,
      contact,
      password,
      emailVerified: false, // 🔐 important
    });

    await newUser.save();

    // 3️⃣ SEND VERIFICATION EMAIL
    const emailSent = await UserEmailVerify(newUser);

    if (!emailSent) {
      // OPTIONAL: rollback user creation
      await User.findByIdAndDelete(newUser._id);

      return res.status(500).json({
        success: false,
        message: "Registration failed. Email could not be sent.",
      });
    }

    // 4️⃣ SUCCESS
    return res.status(201).json({
      success: true,
      message:
        "You are registered successfully. Please check your email to verify your account.",
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
