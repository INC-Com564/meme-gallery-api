import express, { Request, Response } from "express";
import { prisma } from "../prisma";
import { Category } from '@prisma/client';
import { authenticateToken } from "../middleware/auth"; 

const router = express.Router();

router.post(
  "/memes",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { title, url, category } = req.body as {
      title?: string;
      url?: string;
      category?: unknown;
    };

    if (!title || !url || category == null) {
      return res.status(400).json({ error: "title, url and category are required" });
    }

    
    if (!Object.values(Category).includes(category as Category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const meme = await prisma.meme.create({
      data: {
        title,
        url,
        userId,
        category: category as Category,
      },
    });

    res.status(201).json(meme);
  }
);

router.delete("/memes/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid meme ID" });
      return;
    }

    const meme = await prisma.meme.findUnique({ where: { id } });

    if (!meme) {
      res.status(404).json({ error: "Meme not found" });
      return;
    }

    await prisma.meme.delete({ where: { id } });

    res.status(200).json({ message: "Meme deleted successfully", meme });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
