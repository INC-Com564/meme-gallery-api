import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
