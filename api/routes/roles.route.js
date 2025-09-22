import express from "express";
import {
  getRoles,
  getRoleById,
  createRole,
  updateRolePermissions,
  updateRole,
  deleteRole,
} from "../controllers/roles.controller.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getRoles);
router.get("/:id", authenticateToken, getRoleById);
router.post("/", authenticateToken, authorizeRole("Admin"), createRole);
router.put("/:id/permissions", authenticateToken, authorizeRole("Admin"), updateRolePermissions);
router.put("/:id", authenticateToken, authorizeRole("Admin"), updateRole);
router.delete("/:id", authenticateToken, authorizeRole("Admin"), deleteRole);

export default router;
