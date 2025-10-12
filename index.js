import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(express.json());

function logger(req, res, next) {
  console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
}

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
}

app.use(logger);

// The in-memory array is now obsolete and has been removed.

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/memes", async (req, res, next) => {
  try {
    const memes = await prisma.meme.findMany({
      include: { user: true },
    });
    res.json(memes);
  } catch (error) {
    next(error); // Pass the error to the errorHandler middleware
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
        userId: parseInt(userId), // Ensure userId is an integer
      },
    });

    console.log(newMeme);

    res.status(201).json(newMeme);
  } catch (error) {
    next(error); // Pass the error to the errorHandler middleware
  }
});

app.get("/error-test", (req, res, next) => {
  try {
    throw new Error("Test error");
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});