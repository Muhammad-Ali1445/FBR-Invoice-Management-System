import express from "express";
import {
  invoicePost,
  invoiceValidate,
} from "../controllers/invoice.controller.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/post",
  authenticateToken,
  authorizeRole("Admin", "Manager"),
  invoicePost
);

router.post("/validate", invoiceValidate);

export default router;
