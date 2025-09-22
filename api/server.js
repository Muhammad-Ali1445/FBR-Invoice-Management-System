import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import invoiceRouter from "./routes/invoice.route.js";
import authRouter from "./routes/auth.route.js";
import roleRouter from "./routes/roles.route.js"
import userRouter from "./routes/users.route.js"
import permissionRouter from "./routes/permissions.route.js"
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/invoice", invoiceRouter);
app.use("/api/auth", authRouter);
app.use("/api/roles", roleRouter);
app.use("/api/users", userRouter);
app.use("/api/permissions", permissionRouter);

// Test route
app.get("/", (req, res) => {
  res.send("API is working");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
