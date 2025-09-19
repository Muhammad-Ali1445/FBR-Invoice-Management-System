import UserModel from "../models/userModel.js";
import { generateToken } from "../utilis/tokenGeneration.js";

export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Create new user
    const user = new UserModel({ fullname, email, password });
    await user.save();

    console.log("User Store in DB", user);

    // Generate token
    const token = generateToken(user);
    console.log("Generated token", token);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    const responsePayload = {
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    };

    console.log("Response after signIn:", responsePayload);
    res.json(responsePayload);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};


export const signOut = () => {
  
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/signin";
};
