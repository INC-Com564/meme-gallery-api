import request from "supertest";
import app from "./index";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

let token: string;
let memeId: number;

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
    const res = await request(app)
      .post(`/memes/${memeId}/like`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Meme liked");
  });

  it("should unlike a meme if already liked", async () => {
    await request(app)
      .post(`/memes/${memeId}/like`)
      .set("Authorization", `Bearer ${token}`);
    const res = await request(app)
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
