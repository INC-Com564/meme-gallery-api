"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const memeController_1 = require("./controllers/memeController");
const memeRoutes_1 = __importDefault(require("./routes/memeRoutes"));
const prisma_1 = require("./prisma");
const auth_1 = require("./middleware/auth");
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
// const prisma = new PrismaClient();
const likeSchema = joi_1.default.object({
    userId: joi_1.default.number().required()
});
const memeSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    url: joi_1.default.string().uri().required(),
});
app.use(express_1.default.json());
app.use(logger);
app.use("/memes", memeRoutes_1.default);
function logger(req, _res, next) {
    console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
    next();
}
function errorHandler(err, _req, res, _next) {
    console.error(err?.stack ?? err);
    res.status(500).json({ error: "Something went wrong!" });
}
exports.default = app;
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    });
}
app.get("/", (_req, res) => {
    res.send("Hello World");
});
app.get('/memes', memeController_1.getMemes);
app.post('/memes', memeController_1.createMeme);
app.get('/memes/:id', memeController_1.getMemeById);
app.get("/error-test", (_req, _res, next) => {
    try {
        throw new Error("Test error");
    }
    catch (err) {
        next(err);
    }
});
app.put('/memes/:id', memeController_1.updateMeme);
app.delete('/memes/:id', memeController_1.deleteMeme);
// use authenticateToken from ./middleware/auth
app.post("/memes/:id/like", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const { error } = likeSchema.validate({ userId });
    if (error)
        return res.status(400).json({ error: error.details[0].message });
    try {
        const existing = await prisma_1.prisma.userLikesMeme.findFirst({
            where: { userId, memeId: parseInt(id, 10) }
        });
        if (existing) {
            await prisma_1.prisma.userLikesMeme.delete({ where: { id: existing.id } });
            return res.json({ message: "Meme unliked" });
        }
        else {
            await prisma_1.prisma.userLikesMeme.create({
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
// addMeme handled in controllers/memeController
