import express from "express";
import * as youtube from "youtube-search-without-api-key";
import cors from "cors";

const app = express();
app.use(
    cors({
        origin: "*",
    })
);

const options = {
    home: "song lyrics",
    artists: "songs by singers and artists",
    trending: "popular trending songs",
};

app.get("/", (req, res) => {
  res.status(200).send("Success");
});

app.get("/home", async (req, res) => {
    try {
        const results = await youtube.search(options.home);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.get("/artists", async (req, res) => {
    try {
        const results = await youtube.search(options.artists);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.get("/trending", async (req, res) => {
    try {
        const results = await youtube.search(options.trending);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.get("/search/:query", async (req, res) => {
    try {
        const results = await youtube.search(req.params.query.slice(0, 300));
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
