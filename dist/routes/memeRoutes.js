"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../prisma");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/memes", auth_1.authenticateToken, async (req, res) => {
    const { title, url, category } = req.body;
    if (!title || !url || category == null) {
        return res.status(400).json({ error: "title, url and category are required" });
    }
    if (!Object.values(client_1.Category).includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
    }
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const meme = await prisma_1.prisma.meme.create({
        data: {
            title,
            url,
            userId,
            category: category,
        },
    });
    res.status(201).json(meme);
});
exports.default = router;
