import express from "express";
import { getUsers, createUser } from "../controllers/userController.js";

const router = express.Router();

// Định nghĩa các endpoint cho user
router.get("/", getUsers); // Lấy danh sách người dùng
router.post("/", createUser); // Tạo người dùng mới

export default router;
