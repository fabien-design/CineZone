import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";

export async function authenticateUser(req, res, next) {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "No access token provided" });
    }

    try {
        const decodedToken = jwt.verify(token, authConfig.secret);
        req.userId = decodedToken.id;
        req.userIsAdmin = decodedToken.role;
        next();
    } catch (error) {
        console.error("Authentication failed:", error); 
        return res.status(401).json({ message: "Invalid or expired access token" });
    }
};

export async function refreshTokenValidation(req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
        const decodedToken = jwt.verify(
            refreshToken,
            authConfig.refresh_secret,
        );
        req.userId = decodedToken.id;
        req.userIsAdmin = decodedToken.role;
        next();
    } catch (error) {
        console.error("Refresh Token authentication failed:", error);
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};
