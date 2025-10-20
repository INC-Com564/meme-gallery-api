import request from "supertest";
import app from "../index.js";
import { PrismaClient } from '@prisma/client';
import { before } from "node:test";
const prisma = new PrismaClient();

let token;

beforeAll(async () => {
  const user = await prisma.user.create({ data: { username: 'test', password: 'p' } });
});

afterAll(async () => {
  await prisma.$disconnect();
});
describe("Meme Likes", () => {
  it("should like a meme", async () => {
    const res = await request(app)
      .post("/memes/1/like")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Meme liked");
  });

  it("should unlike a meme if already liked", async () => {
    await request(app)
      .post("/memes/1/like")
      .set("Authorization", `Bearer ${token}`);
    const res = await request(app)
      .post("/memes/1/like")
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

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); });
