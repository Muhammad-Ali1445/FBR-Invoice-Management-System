import jwt from "jsonwebtoken";
import UserModel from "../models/userrModel.js";

/**
 * ✅ Authentication Middleware
 * Verifies JWT and attaches user with role & permissions to req.user
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id)
      .populate({
        path: "role",
        populate: { path: "permissions" },
      })
      .populate("permissions");

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid or inactive user" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
};

/**
 * ✅ Role-based Authorization
 * Allow only users with specific roles
 */
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role?.name)) {
      return res.status(403).json({
        error: "Insufficient role privileges",
        required: allowedRoles,
        current: req.user?.role?.name,
      });
    }
    next();
  };
};

/**
 * ✅ Permission-based Authorization
 * Allow only users with specific permission
 */
export const authorizePermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const rolePermissions = req.user.role?.permissions?.map((p) => p.name) || [];
    const userPermissions = req.user.permissions?.map((p) => p.name) || [];

    const hasPermission =
      rolePermissions.includes(requiredPermission) ||
      userPermissions.includes(requiredPermission);

    if (!hasPermission) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: requiredPermission,
      });
    }

    next();
  };
};
