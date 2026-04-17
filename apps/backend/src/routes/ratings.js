import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import {
    getForMovie,
    getMyRating,
    upsert,
    deleteRating,
} from "../controllers/ratingController.js";

const router = express.Router({ mergeParams: true });

// :source = 'tmdb' | 'local'
router.param("source", (req, res, next, source) => {
    if (source !== "tmdb" && source !== "local") {
        return res
            .status(400)
            .json({ message: "source must be 'tmdb' or 'local'" });
    }
    next();
});

router.get("/:source/:id", getForMovie);
router.get("/:source/:id/me", authenticateUser, getMyRating);
router.put("/:source/:id", authenticateUser, upsert);
router.delete("/:source/:id", authenticateUser, deleteRating);

export default router;
