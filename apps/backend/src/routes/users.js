import express from "express";
import { create, login, logout, me, refreshToken } from "../controllers/userController.js";
import { checkEmailNotTaken, hashPassword, validateUser } from "../middlewares/userValidator.js";
import { authenticateUser, refreshTokenValidation } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post('/register', validateUser, checkEmailNotTaken, hashPassword, create);
router.get('/me', authenticateUser, me);
router.post('/login', login);
router.post('/logout', authenticateUser, logout);
router.post('/refresh-token', refreshTokenValidation, refreshToken);

export default router;
