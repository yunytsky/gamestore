import express from "express";
import { getAllGames, getSingleGame } from "../controllers/games.js";

const router = express.Router();

router.get("/", getAllGames);
router.get("/game/:gameId", getSingleGame);

export default router;