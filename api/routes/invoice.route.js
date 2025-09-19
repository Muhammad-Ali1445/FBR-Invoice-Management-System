import express from "express";
import {
  invoicePost,
  invoiceValidate,
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.post("/post", invoicePost);
router.post("/validate", invoiceValidate);

export default router;
