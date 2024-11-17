import express from "express";
import { signin, signup ,getUserInfo} from "../controllers/auth.js";

const router = express.Router();

router.get(`/userinfor`,getUserInfo)
router.post(`/signup`, signup);
router.post(`/signin`, signin );

export default router;