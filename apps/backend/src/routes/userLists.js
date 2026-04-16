import express from "express";
import {
    favorites,
    watchlist,
    watched,
} from "../controllers/userListController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All list routes require auth
router.use(authenticateUser);

router.get("/favorites", favorites.getList);
router.post("/favorites/:source/:id", favorites.addToList);
router.delete("/favorites/:source/:id", favorites.removeFromList);
router.get("/favorites/:source/:id/status", favorites.getStatus);

router.get("/watchlist", watchlist.getList);
router.post("/watchlist/:source/:id", watchlist.addToList);
router.delete("/watchlist/:source/:id", watchlist.removeFromList);
router.get("/watchlist/:source/:id/status", watchlist.getStatus);

router.get("/watched", watched.getList);
router.post("/watched/:source/:id", watched.addToList);
router.delete("/watched/:source/:id", watched.removeFromList);
router.get("/watched/:source/:id/status", watched.getStatus);

export default router;
