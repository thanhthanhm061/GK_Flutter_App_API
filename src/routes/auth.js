import express from "express";
import { signup } from "../controllers/auth.js";

const router = express.Router();

router.post(`/signup`, signup);
router.post(`/signin`, async (req, res) => {
    console.log("Signin");
})

export default router;