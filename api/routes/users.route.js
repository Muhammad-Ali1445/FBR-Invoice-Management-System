import express from "express";
import {
  getUsers,
  getUserById,
  updateUserRole,
  updateUserPermissions,
  deactivateUser,
  activateUser,
} from "../controllers/users.controller.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, authorizeRole("Admin", "Manager"), getUsers);
router.get("/:id", authenticateToken, getUserById);
router.put(
  "/:id/role",
  authenticateToken,
  authorizeRole("Admin"),
  updateUserRole
);
router.put(
  "/:id/permissions",
  authenticateToken,
  authorizeRole("Admin"),
  updateUserPermissions
);
router.put(
  "/:id/deactivate",
  authenticateToken,
  authorizeRole("Admin"),
  deactivateUser
);
router.put(
  "/:id/activate",
  authenticateToken,
  authorizeRole("Admin"),
  activateUser
);

export default router;
