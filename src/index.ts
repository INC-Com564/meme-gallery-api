import express, { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { getMemes, createMeme, getMemeById, updateMeme, deleteMeme } from './controllers/memeController';
import memeRoutes from "./routes/memeRoutes";
import { prisma } from './prisma';
import { authenticateToken } from "./middleware/auth"; 

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
    }
  }
}

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const likeSchema = Joi.object({
  userId: Joi.number().required()
});
const memeSchema = Joi.object({
  title: Joi.string().required(),
  url: Joi.string().uri().required(),
});

app.use(express.json());
app.use(logger);
app.use("/memes", memeRoutes);

function logger(req: Request, _res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
}

function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err?.stack ?? err);
  res.status(500).json({ error: "Something went wrong!" });
}



export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
}

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World");
});

app.get('/memes', getMemes);
app.post('/memes', createMeme);
app.get('/memes/:id', getMemeById);

app.get("/error-test", (_req: Request, _res: Response, next: NextFunction) => {
  try {
    throw new Error("Test error");
  } catch (err) {
    next(err);
  }
});

app.put('/memes/:id', updateMeme);

app.delete('/memes/:id', deleteMeme);



app.post("/memes/:id/like", authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const { error } = likeSchema.validate({ userId });
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    
    const existing = await prisma.userLikesMeme.findFirst({
      where: { userId, memeId: parseInt(id, 10) }
    });

    if (existing) {
      await prisma.userLikesMeme.delete({ where: { id: existing.id } });
      return res.json({ message: "Meme unliked" });
    } else {
      await prisma.userLikesMeme.create({
        data: { userId, memeId: parseInt(id, 10) }
      });
      return res.json({ message: "Meme liked" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.use(errorHandler);


