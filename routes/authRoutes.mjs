import { Router } from "express";
import { signup, login, getMe } from "../controllers/authController.mjs";
import { authenticate } from "../middleware/auth.mjs";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/check", authenticate, getMe);

export default router;
