import express from "express";
import { getMemes, getMemeById, createMeme, updateMeme, deleteMeme } from "../controllers/memeController.js";

const router = express.Router();

router.get("/", getMemes);
router.get("/:id", getMemeById);
router.post("/", createMeme);
router.put("/:id", updateMeme);
router.delete("/:id", deleteMeme);

export default router;