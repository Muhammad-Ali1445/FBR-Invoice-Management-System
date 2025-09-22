import UserModel from "../models/userrModel.js";
import { generateToken } from "../utilis/tokenGeneration.js";
import mongoose from "mongoose";

// ---- Signup ------
export const signup = async (req, res) => {
  try {
    const { fullname, email, password, roleName } = req.body;

    // Check existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Find role (default = Viewer)
    const Role = mongoose.model("Role");
    const role = await Role.findOne({ name: roleName || "Viewer" });
    if (!role) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Create user
    const user = new UserModel({
      fullname,
      email,
      password,
      role: role._id,
    });
    await user.save();

    await role.updateUserCount();

    const token = generateToken(user);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: role.name,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---- Signin ------
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email, isActive: true }).populate(
      "role"
    );
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role.name,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- SIGNOUT --------------------
export const signOut = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "Signout successful. Please remove token from client storage.",
    });
  } catch (error) {
    console.error("Signout error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during signout" });
  }
};
