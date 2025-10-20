import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { Meme } from '../types/index';

let memes: Meme[] = [
  { id: 1, title: 'Distracted Boyfriend', url: 'https://i.imgur.com/example1.jpg' }
];

export const getMemes = async (req: Request, res: Response) => {
  try {
    // prefer DB-backed memes when available
    const dbMemes = await prisma.meme.findMany({ include: { user: true } });
    if (dbMemes && dbMemes.length > 0) return res.json(dbMemes);
    return res.json(memes);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getMemeById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const meme = memes.find((m) => m.id === parseInt(id, 10));
  if (!meme) return res.status(404).json({ error: 'Meme not found' });
  res.json(meme);
};

export const createMeme = async (req: Request, res: Response) => {
  const { title, url, userId } = req.body as Partial<Meme>;
  if (!title || !url) return res.status(400).json({ error: 'Title and url required' });
  const newMeme = { id: memes.length + 1, title, url, userId } as Meme;
  memes.push(newMeme);
  res.status(201).json(newMeme);
};

export const updateMeme = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, url } = req.body;
  const meme = memes.find((m) => m.id === parseInt(id, 10));
  if (!meme) return res.status(404).json({ error: 'Meme not found' });
  meme.title = title || meme.title;
  meme.url = url || meme.url;
  res.json(meme);
};

export const deleteMeme = async (req: Request, res: Response) => {
  const { id } = req.params;
  const index = memes.findIndex((m) => m.id === parseInt(id, 10));
  if (index === -1) return res.status(404).json({ error: 'Meme not found' });
  const deleted = memes.splice(index, 1);
  res.json(deleted[0]);
};
