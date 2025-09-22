import express from "express";
import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permissions.controller.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getPermissions);
router.post("/", authenticateToken, authorizeRole("Admin"), createPermission);
router.put("/:id", authenticateToken, authorizeRole("Admin"), updatePermission);
router.delete("/:id", authenticateToken, authorizeRole("Admin"), deletePermission);

export default router;
