import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import database from "../services/database.js";
import authConfig from "../config/auth.config.js";

export async function create(req, res) {
    const { username, email, hashedPassword } = req.body;

    try {
        const [result] = await database.query(
            "INSERT INTO users (username, email, password) VALUES (?,?,?)",
            [username, email, hashedPassword],
        );

        if (result) {
            res.status(201).json({
                message: "User created successfully",
                id: result.insertId,
            });
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const [users] = await database.query(
            "SELECT id, username, email, role, password FROM users WHERE email =? LIMIT 1",
            [email],
        );

        if (users.length === 0) {
            return res.status(401).send({
                message: "Wrong credentials",
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send({
                message: "Wrong credentials",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            authConfig.secret,
            {
                expiresIn: authConfig.secret_expires_in,
            },
        );

        const refreshToken = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            authConfig.refresh_secret,
            {
                expiresIn: authConfig.refresh_secret_expires_in,
            },
        );

        // Update the user's refresh token in the database
        await database.query(
            "UPDATE users SET refresh_token = ? WHERE id = ?",
            [refreshToken, user.id],
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/",
        };

        res.cookie("accessToken", token, {
            ...cookieOptions,
            maxAge: 60 * 60 * 1000, // 60 minutes
        });
        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "an error has occured",
        });
    }
}

export async function me(req, res) {
    try {
        const [users] = await database.query(
            "SELECT id, username, email, role FROM users WHERE id = ? LIMIT 1",
            [req.userId],
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(users[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "An error has occurred" });
    }
}

export async function logout(req, res) {
    const userId = req.userId; // Get userId from the authenticateUser middleware

    try {
        // Clear the refresh token in the database
        await database.query(
            "UPDATE users SET refresh_token = NULL WHERE id = ?",
            [userId],
        );

        const clearOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/",
        };
        res.clearCookie("accessToken", clearOptions);
        res.clearCookie("refreshToken", clearOptions);

        res.status(200).send({
            message: "Logged out successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "an error has occured",
        });
    }
}

export async function refreshToken(req, res) {
    try {
        const userId = req.userId; // Get userId from the refreshTokenValidation middleware
        const refreshToken = req.cookies.refreshToken;

        // Check if the refresh token has been revoked
        const [[userData]] = await database.query(
            "SELECT refresh_token, role FROM users WHERE id = ?",
            [userId],
        );

        if (!userData || !userData.refresh_token) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Check if the refresh token in the database matches the one from the client
        if (userData.refresh_token !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
            {
                id: userId,
                role: userData.role,
            },
            authConfig.secret,
            { expiresIn: authConfig.secret_expires_in },
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/",
            maxAge: 60 * 60 * 1000, // 60 minutes
        });

        return res
            .status(200)
            .json({ message: "Access token refreshed successfully" });
    } catch (error) {
        console.error("Refresh Token failed:", error);
        return res.status(500).json({ message: "Failed to refresh token" });
    }
}
