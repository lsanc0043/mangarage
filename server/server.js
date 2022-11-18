import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mangasRouter from "./routes/manga.js";
import usersRouter from "./routes/users.js";
import questionsRouter from "./routes/questions.js";
import db from "./db/db-connection.js";
import MangaDump from "./dumps/manga_dump.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REACT_BUILD_DIR = path.join(__dirname, "..", "client", "build");
app.use(express.static(REACT_BUILD_DIR));
const PORT = process.env.PORT || 4020;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/manga", mangasRouter);
app.use("/users", usersRouter);
app.use("/questions", questionsRouter);

app.get("/", (req, res) => {
  res.send("hello from server.js in the backend");
});

app.get("/clear", async (req, res) => {
  await db.any("DROP TABLE IF EXISTS readmangas", [true]);
  await db.any("DROP TABLE IF EXISTS manga", [true]);
  await db.any("DROP TABLE IF EXISTS users", [true]);
  res.send({ type: "success" });
});

app.get("/initialize", async (req, res) => {
  console.log("request received");
  await db.any("DROP TABLE IF EXISTS readmangas", [true]);
  await db.any("DROP TABLE IF EXISTS manga", [true]);
  await db.any("DROP TABLE IF EXISTS users", [true]);
  await db.any(
    "CREATE TABLE IF NOT EXISTS manga (id serial primary key, title text not null unique, author text not null, year text, status text,  last_updated text, description text, genres text[], cover text not null, characters text[])",
    [true]
  );
  await db.any(
    "CREATE TABLE IF NOT EXISTS users (id serial primary key, username text unique, email text unique not null, password text not null, last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    [true]
  );
  await db.any(
    "CREATE TABLE IF NOT EXISTS readmangas (user_id int not null, manga_id int not null, rating decimal not null, PRIMARY KEY ( user_id, manga_id), FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE, FOREIGN KEY (manga_id) REFERENCES manga(id) ON UPDATE CASCADE)",
    [true]
  );
  MangaDump.map(async (query) => await db.any(`${query}`, [true]));
  res.send({ type: "success" });
});

app.listen(PORT, () => console.log(`sup, you are listening to port ${PORT}`));
