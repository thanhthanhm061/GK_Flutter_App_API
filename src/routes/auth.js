import express from "express";
import { signin, signup, getUserInfo, getUsers } from "../controllers/auth.js";

const router = express.Router();

router.get(`/usersinfo`, getUserInfo);
router.get(`/users`, getUsers);
router.get(`/signup`, (req, res) => res.render('signup'));
router.get(`/signin`, (req, res) => res.render('signin'));

router.post(`/signup`, signup); 
router.post(`/signin`, signin); 

export default router;
