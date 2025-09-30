import express from "express";
const app = express();
const port = 3000;

app.use(express.json());

const memes = [
  { id: 1, "title": "Coding Cat",
  "url": "https://i.imgur.com/codingcat.jpg" },
  { id: 2, title: "Distracted Boyfriend", url: "https://i.imgur.com/example1.jpg" },
  { id: 3, title: "Success Kid", url: "https://i.imgur.com/example2.jpg" }
];

app.get("/", (req, res) => {
    res.send("Hello World");
});


app.get("/memes", (req, res) => {
    res.json(memes);
});

app.post("/memes", (req, res) => {
    const { title, url } = req.body || {}; 

    if (!title || !url){
        return res.status(400).json({ error: "Title and Url are required" });
    }
    
    const newMeme = { id: memes.length + 1, title, url };
    memes.push(newMeme);

    console.log(memes);

    res.status(201).json(newMeme);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});