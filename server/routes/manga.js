import fetch from "node-fetch";
import db from "../db/db-connection.js";
import { Router } from "express";
const router = Router();
import https from "https";

// retrieves all manga poster information
router.get("/", async (req, res) => {
  try {
    const mangas = await db.any("SELECT * FROM manga ORDER BY title", [true]);
    console.log("retrieved all mangas");
    res.send(mangas);
  } catch (e) {
    console.log("manga get", e);
    res.status(400).send({ e });
  }
});

async function getChars(manga) {
  const regex = /[^\w\s]|_/g; // removes any special characters
  let mangaName = "";
  // special cases where the name is different across the two APIs
  switch (manga) {
    case "Ace of Diamond":
      mangaName = "ace-of-the-diamond";
      break;
    case "Detective Conan":
      mangaName = "case-closed";
      break;
    case "Kimetsu no Yaiba":
      mangaName = "demon-slayer-kimetsu-no-yaiba";
      break;
    case "Sinryeong":
      mangaName = "godly-bells";
      break;
    case "Haikyu":
      mangaName = "haikyuu";
      break;
    case "Boku no Hero Academia":
      mangaName = "my-hero-academia";
      break;
    case "Omniscient Readers Viewpoint":
      mangaName = "omniscient-reader";
      break;
    case "One PunchMan":
      mangaName = "one-punch-man";
      break;
    case "Rave":
      mangaName = "rave-master";
      break;
    case "Nanatsu no Taizai":
      mangaName = "the-seven-deadly-sins";
      break;
    case "Shingeki no Kyojin":
      mangaName = "attack-on-titan";
      break;
    case "SPYFAMILY":
      mangaName = "spy-x-family";
      break;
    case "Tate no Yuusha no Nariagari":
      mangaName = "the-rising-of-the-shield-hero";
      break;
    case "Tensei Shitara Slime Datta Ken":
      mangaName = "that-time-i-got-reincarnated-as-a-slime";
      break;
    case "The World God Only Knows":
      mangaName = "kami-nomi-zo-shiru-sekai";
      break;
    case "Akatsuki no Yona":
      mangaName = "yona-of-the-dawn";
      break;
    case "YuYuHakusho":
      mangaName = "yu-yu-hakusho";
      break;
    default:
      mangaName = manga
        .split(" ")
        .filter((word) => !regex.test(word))
        .join("-")
        .replace(/[()]/g, "");
  }
  const url = `https://www.anime-planet.com/manga/${mangaName}/characters`;
  //   console.log(url);
  try {
    const response = await fetch(url);
    const data = await response.text(); // uses text instead of json because i'm retrieving data from a webpage
    const reducedData = data
      .slice(data.indexOf('<div class="pure-1 md-4-5">'))
      .slice(
        0,
        data
          .slice(data.indexOf('<div class="pure-1 md-4-5">'))
          .indexOf("<style>")
      );
    const characters = reducedData.matchAll(/"name">(.*?)</g); // find the chunk of the html data that is between the specified regex
    // console.log(Array.from(characters, (x) => x[1]));
    return Array.from(characters, (x) => x[1]);
  } catch (e) {
    console.log("characters get", e);
  }
}

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

const getManga = async (search, source) => {
  console.log("search input", search);
  // grabs list of top 10 matching searches
  const allData = await fetchData(
    `https://api.mangadex.org/manga?limit=5&title=${search}`
  );
  const mangaData = allData.data.filter((manga) => manga.type === "manga"); // removes doujinshis or one-shots

  switch (source) {
    case "showall":
      return mangaData.map((manga) => manga.attributes.title.en);
    case "filter":
      // grabs the ONE manga that matches the searched name the most
      const filtered = mangaData.filter((manga) =>
        search === "prince of tennis"
          ? manga.attributes.title.en.toLowerCase() === "the prince of tennis"
          : search === "spy x family"
          ? manga.attributes.title.en.toLowerCase() === "spy??family"
          : search === "yu yu hakusho"
          ? manga.attributes.title.en.toLowerCase() === "yu???yu???hakusho"
          : manga.attributes.title.en
          ? manga.attributes.title.en.toLowerCase() === search.toLowerCase()
          : ""
      );
      // a separate API call for the filtered manga's cover page
      const filteredCover = await fetchData(
        `https://api.mangadex.org/cover/${
          filtered[0].relationships.filter((tag) => tag.type === "cover_art")[0]
            .id
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
      // only grabs the sections of the large object that i need
      return filtered.map((manga) => ({
        id: manga.id,
        title: manga.attributes.title.en,
        author: filteredAuthor.data.attributes.name,
        year: manga.attributes.year,
        status: manga.attributes.status,
        last_updated: lastChapter.data.attributes.updatedAt,
        description: manga.attributes.description.en,
        genres: manga.attributes.tags
          .filter((tag) => tag.attributes.group === "genre")
          .map((tag) => tag.attributes.name.en),
        cover: filteredCover.data.attributes.fileName,
      }));
    default:
      break;
  }
};

// get request, post to the backend
router.get("/post/:search", async (req, res) => {
  const search = req.params.search;
  const results = await getManga(search, "showall");
  res.send(results);
  //   try {
  //     const manga = await db.any(
  //       "INSERT INTO manga (title, author, year, status, description, genres, cover, characters, last_updated) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
  //       [
  //         results[0].title,
  //         results[0].author,
  //         results[0].year,
  //         results[0].status,
  //         results[0].description,
  //         `{${results[0].genres}}`,
  //         results[0].cover,
  //         `{${results[0].chars}}`,
  //         results[0].last_updated,
  //       ]
  //     );
  //   } catch (e) {
  //     console.log("manga post", e);
  //     res.status(400).send({ e });
  //   }
});

router.get("/select/:search", async (req, res) => {
  const search = req.params.search;
  const results = await getManga(search, "filter");
  res.send(results);
});

router.get("/:mangaid/:coverid", async (req, res) => {
  const mangaid = req.params.mangaid;
  const coverid = req.params.coverid;
  const url = `https://uploads.mangadex.org/covers/${mangaid}/${coverid}`;
  const request = https.get(url, function (response) {
    const contentType = response.headers["content-type"];
    // console.log(contentType);
    res.setHeader("Content-Type", contentType);
    response.pipe(res);
  });
  request.on("error", function (e) {
    console.error(e);
  });
});

export default router;
