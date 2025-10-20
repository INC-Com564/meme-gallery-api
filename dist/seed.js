"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("./index"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let token;
let memeId;
beforeAll(async () => {
    await prisma.$connect();
    const user = await prisma.user.create({ data: { username: 'test', password: 'p' } });
    token = String(user.id);
    const meme = await prisma.meme.create({
        data: {
            title: "Distracted Boyfriend",
            url: "https://i.imgur.com/example1.jpg",
            userId: user.id
        }
    });
    memeId = meme.id;
});
afterAll(async () => {
    await prisma.userLikesMeme.deleteMany({});
    await prisma.meme.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
});
describe("Meme Likes", () => {
    it("should like a meme", async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post(`/memes/${memeId}/like`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Meme liked");
    });
    it("should unlike a meme if already liked", async () => {
        await (0, supertest_1.default)(index_1.default)
            .post(`/memes/${memeId}/like`)
            .set("Authorization", `Bearer ${token}`);
        const res = await (0, supertest_1.default)(index_1.default)
            .post(`/memes/${memeId}/like`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Meme unliked");
    });
});
async function main() {
    const user = await prisma.user.create({
        data: { username: "alice", password: "pass1" }
    });
    await prisma.meme.create({
        data: {
            title: "Distracted Boyfriend",
            url: "https://i.imgur.com/example1.jpg",
            userId: user.id
        }
    });
}
if (process.env.NODE_ENV !== "test") {
    main()
        .then(() => prisma.$disconnect())
        .catch(e => { console.error(e); prisma.$disconnect(); });
}
