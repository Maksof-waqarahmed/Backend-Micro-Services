import express from "express";
import { userRegsiter } from "../controllers/user-auth-controller";

const router = express.Router();

router.post("/register", userRegsiter);

export default router;