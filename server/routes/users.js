import express from "express";
import {verifyJWT} from "../middleware/auth.js";
import { addFunds, addToCart, buyGames, getPurchasedGames, getUser, getUserCart, removeFromCart } from "../controllers/users.js";

const router = express.Router();

router.get("/:userId", verifyJWT, getUser);
router.get("/:userId/games", verifyJWT, getPurchasedGames);
router.get("/:userId/cart", verifyJWT, getUserCart);

router.post("/:userId/cart/add", verifyJWT, addToCart);
router.post("/:userId/cart/buy", verifyJWT, buyGames);

router.patch("/:userId/balance/add", verifyJWT, addFunds);

router.delete("/:userId/cart/remove", verifyJWT, removeFromCart);


export default router;