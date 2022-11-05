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
  const filtered = mangaData.filter((manga) =>
    search === "prince of tennis"
      ? manga.attributes.title.en.toLowerCase() === "the prince of tennis"
      : search === "spy x family"
      ? manga.attributes.title.en.toLowerCase() === "spy×family"
      : search === "yu yu hakusho"
      ? manga.attributes.title.en.toLowerCase() === "yu★yu★hakusho"
      : manga.attributes.title.en
      ? manga.attributes.title.en.toLowerCase() === search.toLowerCase()
      : ""
  );
  // a separate API call for the filtered manga's cover page
  const filteredCover = await fetchData(
    `https://api.mangadex.org/cover/${
      filtered[0].relationships.filter((tag) => tag.type === "cover_art")[0].id
    }`
  );
  // a separate API call for the filtered manga's author
  const filteredAuthor = await fetchData(
    `https://api.mangadex.org/author/${
      filtered[0].relationships.filter((tag) => tag.type === "author")[0].id
    }`
  );
  // a separate API call for the filtered manga's last updated chapter
  const lastChapter = await fetchData(
    `https://api.mangadex.org/chapter/${filtered[0].attributes.latestUploadedChapter}`
  );
  return {
    manga: filtered,
    cover: filteredCover,
    author: filteredAuthor,
    lastChapter: lastChapter,
  };
};

// get request
router.get("/post/:search", async (req, res) => {
  const search = req.params.search;
  const results = await getManga(search);
  res.send(results);
});

export default router;
