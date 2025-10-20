"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeme = exports.updateMeme = exports.createMeme = exports.getMemeById = exports.getMemes = void 0;
const prisma_1 = require("../prisma");
let memes = [
    { id: 1, title: 'Distracted Boyfriend', url: 'https://i.imgur.com/example1.jpg' }
];
const getMemes = async (req, res) => {
    try {
        // prefer DB-backed memes when available
        const dbMemes = await prisma_1.prisma.meme.findMany({ include: { user: true } });
        if (dbMemes && dbMemes.length > 0)
            return res.json(dbMemes);
        return res.json(memes);
    }
    catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};
exports.getMemes = getMemes;
const getMemeById = async (req, res) => {
    const { id } = req.params;
    const meme = memes.find((m) => m.id === parseInt(id, 10));
    if (!meme)
        return res.status(404).json({ error: 'Meme not found' });
    res.json(meme);
};
exports.getMemeById = getMemeById;
const createMeme = async (req, res) => {
    const { title, url, userId } = req.body;
    if (!title || !url)
        return res.status(400).json({ error: 'Title and url required' });
    const newMeme = { id: memes.length + 1, title, url, userId };
    memes.push(newMeme);
    res.status(201).json(newMeme);
};
exports.createMeme = createMeme;
const updateMeme = async (req, res) => {
    const { id } = req.params;
    const { title, url } = req.body;
    const meme = memes.find((m) => m.id === parseInt(id, 10));
    if (!meme)
        return res.status(404).json({ error: 'Meme not found' });
    meme.title = title || meme.title;
    meme.url = url || meme.url;
    res.json(meme);
};
exports.updateMeme = updateMeme;
const deleteMeme = async (req, res) => {
    const { id } = req.params;
    const index = memes.findIndex((m) => m.id === parseInt(id, 10));
    if (index === -1)
        return res.status(404).json({ error: 'Meme not found' });
    const deleted = memes.splice(index, 1);
    res.json(deleted[0]);
};
exports.deleteMeme = deleteMeme;
