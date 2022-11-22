import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mangasRouter from "./routes/manga.js";
import usersRouter from "./routes/users.js";
import questionsRouter from "./routes/questions.js";
import db from "./db/db-connection.js";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REACT_BUILD_DIR = path.join(__dirname, "..", "client", "build");
app.use(express.static(REACT_BUILD_DIR));
const PORT = process.env.PORT || 4020;

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/manga", mangasRouter);
app.use("/users", usersRouter);
app.use("/questions", questionsRouter);

app.get("/cover", async (req, res) => {
  const url =
    "https://uploads.mangadex.org/covers/6a468761-5bd6-4de0-a0cb-47cb456ac2e0/6fede191-79a0-453b-8b8d-939ab067f657.jpg";
  const request = https.get(url, function (response) {
    const contentType = response.headers["content-type"];

    console.log(contentType);

    res.setHeader("Content-Type", contentType);

    response.pipe(res);
  });

  request.on("error", function (e) {
    console.error(e);
  });
  // const base64Image = Buffer.from(
  //   (await axios.get(url, { responseType: "arraybuffer" })).data
  // ).toString("base64");
  // var img = Buffer.from(base64Image, "base64");
  // res.writeHead(200, {
  //   "Content-Type": "image/jpg",
  //   "Content-Length": img.length,
  // });
  // res.send();
  // res.send({ base64: base64Image });
  // res.end(img); // request.get(url).pipe(res);
  // request.get(url).pipe(res);
});

app.get("/clear", async (req, res) => {
  await db.any("DROP TABLE IF EXISTS readmangas", [true]);
  await db.any("DROP TABLE IF EXISTS manga", [true]);
  await db.any("DROP TABLE IF EXISTS users", [true]);
  res.send({ type: "success" });
});

app.listen(PORT, () => console.log(`sup, you are listening to port ${PORT}`));
