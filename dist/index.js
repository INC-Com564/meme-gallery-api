"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMeme = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const prisma = new client_1.PrismaClient();
const likeSchema = joi_1.default.object({
    userId: joi_1.default.number().required()
});
const memeSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    url: joi_1.default.string().uri().required(),
});
app.use(express_1.default.json());
function logger(req, _res, next) {
    console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
    next();
}
function errorHandler(err, _req, res, _next) {
    console.error(err?.stack ?? err);
    res.status(500).json({ error: "Something went wrong!" });
}
app.use(logger);
exports.default = app;
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    });
}
app.get("/", (_req, res) => {
    res.send("Hello World");
});
app.get("/memes", async (_req, res, next) => {
    try {
        const memes = await prisma.meme.findMany({
            include: { user: true },
        });
        res.json(memes);
    }
    catch (error) {
        next(error);
    }
});
app.post("/memes", async (req, res, next) => {
    try {
        const { title, url, userId } = req.body || {};
        if (!title || !url || !userId) {
            return res.status(400).json({ error: "Title, Url, and userId are required" });
        }
        const newMeme = await prisma.meme.create({
            data: {
                title,
                url,
                userId: parseInt(userId, 10),
            },
        });
        console.log(newMeme);
        res.status(201).json(newMeme);
    }
    catch (error) {
        next(error);
    }
});
app.get("/error-test", (_req, _res, next) => {
    try {
        throw new Error("Test error");
    }
    catch (err) {
        next(err);
    }
});
function authenticateToken(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing token" });
    }
    const token = auth.split(" ")[1];
    const userId = Number(token);
    if (Number.isNaN(userId)) {
        return res.status(401).json({ error: "Invalid token" });
    }
    req.user = { userId };
    next();
}
app.post("/memes/:id/like", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const { error } = likeSchema.validate({ userId });
    if (error)
        return res.status(400).json({ error: error.details[0].message });
    try {
        const existing = await prisma.userLikesMeme.findFirst({
            where: { userId, memeId: parseInt(id, 10) }
        });
        if (existing) {
            await prisma.userLikesMeme.delete({ where: { id: existing.id } });
            return res.json({ message: "Meme unliked" });
        }
        else {
            await prisma.userLikesMeme.create({
                data: { userId, memeId: parseInt(id, 10) }
            });
            return res.json({ message: "Meme liked" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
app.use(errorHandler);
const addMeme = async (request, response) => {
    const { title, url } = request.body;
    const { error } = memeSchema.validate(request.body);
    if (error) {
        throw new Error(error?.details[0]?.message);
    }
    const newMeme = await prisma.meme.create({
        // @ts-ignore
        data: { title, url, userId: parseInt(request.user.userId) }, // use authenticated userID
    });
    response.status(201).json(newMeme);
};
exports.addMeme = addMeme;
