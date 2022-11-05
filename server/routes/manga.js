import fetch from "node-fetch";
import { Router } from "express";
const router = Router();

// helper function to fetch data from API
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log("helper function get", e);
  }
};

const getManga = async (search) => {
  console.log("search input", search);
  // grabs list of top 10 matching searches
  const allData = await fetchData(
    `https://api.mangadex.org/manga?limit=10&title=${search}`
  );
  const mangaData = allData.data.filter((manga) => manga.type === "manga"); // removes doujinshis or one-shots
  // grabs the ONE manga that matches the searched name the most
  const filtered = mangaData.filter(
    (manga) => search.toLowerCase() === manga.attributes.title.en.toLowerCase()
  );
  return filtered;
};

// get request
router.get("/post/:search", async (req, res) => {
  const search = req.params.search;
  const results = await getManga(search);
  res.send(results);
});

export default router;
