import express from "express";
import { getUsers, createUser, updateUser, deleteUser, getUserInfo } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/me", getUserInfo);

export default router;
