import db from "../db/db-connection.js";
import { Router } from "express";
import MangaDump from "../dumps/manga_dump.js";

const router = Router();

const validLogin = [0]; // checks for valid login [0] = false, [1] = true

// retrieves all users and displays, all users have encrypted passwords
router.get("/", async (req, res) => {
  await db.any("CREATE EXTENSION IF NOT EXISTS pgcrypto", []);
  await db.any(
    "CREATE TABLE IF NOT EXISTS users (id serial primary key, username text unique, email text unique not null, password text not null, last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    [true]
  );
  await db.any(
    "CREATE TABLE IF NOT EXISTS manga (id serial primary key, manga_id text, title text not null unique, author text not null, year text, status text,  last_updated text, description text, genres text[], cover text not null, characters text[])",
    [true]
  );
  await db.any(
    "CREATE TABLE IF NOT EXISTS readinglist (id serial primary key, user_id int not null, manga_name text not null, manga_id text not null, status text[], rating text);",
    [true]
  );
  await db.any(
    "CREATE TABLE IF NOT EXISTS readmangas (user_id int not null, manga_id int not null, rating decimal not null, PRIMARY KEY ( user_id, manga_id), FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE, FOREIGN KEY (manga_id) REFERENCES manga(id) ON UPDATE CASCADE);",
    [true]
  );
  const mangas = await db.any("SELECT * FROM manga ORDER BY title", [true]);
  if (mangas.length !== 48) {
    for (let i = 1; i <= 48; i++) {
      const checkExists = await db.query(
        "SELECT EXISTS(SELECT 1 FROM manga WHERE id=$1)",
        [i]
      );
      if (checkExists[0].exists === false) {
        await db.query(`${MangaDump[i - 1]}`, true);
      }
    }
  }
  const admin = await db.any("SELECT FROM users WHERE username='admin'");
  if (admin.length === 0) {
    await db.any(
      "INSERT INTO users (id, username, email, password) VALUES (1, 'admin', 'admin@gmail.com', $1);",
      ["$2a$06$19HzdMJjUYyjdIHuvIHZW.WINc8.qJrJD3fiw7yKRRUY/7e/VEmda"]
    );
    await db.any("SELECT pg_catalog.setval('public.users_id_seq', 1, true)");
  }

  try {
    const allUsers = await db.any(
      "SELECT id, username, email, last_login FROM users ORDER BY id",
      [true]
    );
    console.log("retrieved all users");
    res.send(allUsers);
  } catch (e) {
    console.log("user get", e);
    res.status(400).send({ e });
  }
});

// posts info from the user login to check if the user is valid and the password is correct
router.post("/validate", async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const decodedUsers = await db.any(
      "SELECT id FROM users WHERE (username = $1 OR email = $1) and password = crypt($2, password);",
      [user.username, user.password]
    );
    // if user exists
    if (decodedUsers.length > 0) {
      validLogin[0] = 1;
      res.status(200).send({ type: "success" });
      console.log("success", user.username, "is logged in");
    } else {
      validLogin[0] = 0;
      res.status(200).send({ type: "fail" });
      console.log("failed login");
    }
  } catch (e) {
    console.log("user validate", e);
    res.status(400).send({ e });
  }
});

// register a user, encrypt the password
router.post("/add", async (req, res) => {
  console.log(req.body);
  const user = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  };
  const userLog = await db.any("SELECT * FROM users WHERE username=$1", [
    user.username,
  ]);
  const allUsers = await db.any("SELECT * FROM users", [true]);
  try {
    console.log(userLog);
    console.log("all users", allUsers);
    if (userLog.length === 0) {
      const newUser = await db.any(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, crypt($3, gen_salt('bf')));",
        [user.username, user.email, user.password]
      );
      console.log("successful registration for", user.username);
    }
  } catch (e) {
    console.log("user register", e);
    res.status(400).send({ e });
  }
});

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const login = req.body.last_login;
  console.log([userId, login]);
  try {
    await db.any("UPDATE users SET last_login=$1 WHERE id=$2", [login, userId]);
    console.log("the user: ", userId, "has been updated");
  } catch (e) {
    console.log(e);
    res.status(400).send({ e });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    await db.any("DELETE FROM readmangas WHERE user_id=$1", [userId]);
    await db.any("DELETE FROM users WHERE id=$1", [userId]);
    console.log(userId, "has been deleted");
  } catch (e) {
    console.log(e);
    res.status(400).send({ e });
  }
});

// retrieves readmangas junction table info, filtered and separated by user id
router.get("/read/:id", async (req, res) => {
  await db.any(
    "CREATE TABLE IF NOT EXISTS readmangas (user_id int not null, manga_id int not null, rating decimal not null, PRIMARY KEY ( user_id, manga_id), FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE, FOREIGN KEY (manga_id) REFERENCES manga(id) ON UPDATE CASCADE);",
    [true]
  );
  try {
    const readMangas = await db.any(
      "SELECT * FROM readmangas where user_id=$1 ORDER BY manga_id",
      [req.params.id]
    );
    console.log("retrieved", req.params.id, "reading manga");
    res.send(readMangas);
  } catch (e) {
    console.log("readmangas get", e);
    res.status(400).send({ e });
  }
});

// adds a [user_id, manga_id] entry to the readmangas junction table
router.post("/read", async (req, res) => {
  const user_read = {
    user: req.body.user,
    manga: req.body.manga,
    rating: req.body.rating,
  };
  try {
    // only attempt adding it to the table if it doesn't exist
    const checkExists = await db.query(
      "SELECT EXISTS(SELECT 1 FROM readmangas WHERE user_id=$1 AND manga_id=$2)",
      [user_read.user, user_read.manga]
    );
    if (!checkExists[0].exists) {
      await db.any(
        "INSERT INTO readmangas(user_id, manga_id, rating) VALUES ($1, $2, $3)",
        [user_read.user, user_read.manga, user_read.rating]
      );
      console.log("added", user_read.manga, "to read mangas");
      res.send({ type: "success" });
    } else {
      res.send({ type: "fail" });
    }
  } catch (e) {
    console.log("readmangas post", e);
    res.status(400).send({ e });
  }
});

// removes a [user_id, manga_id] entry from the readmangas junction table
router.delete("/read/:userid/:mangaid", async (req, res) => {
  const userid = req.params.userid;
  const mangaid = req.params.mangaid;
  try {
    if (Number(mangaid) === 0) {
      await db.query("DELETE FROM readmangas WHERE user_id=$1", [userid]);
      res.send({ type: "success" });
    } else {
      await db.query(
        "DELETE FROM readmangas WHERE user_id=$1 AND manga_id=$2",
        [userid, mangaid]
      );
      console.log("deleted", mangaid, "from read mangas");
      res.send({ type: "success" });
    }
  } catch (e) {
    console.log("readmangas delete", e);
    res.status(400).send({ e });
  }
});

// retrieves readinglist junction table info, filtered and separated by user id
router.get("/reading/:id", async (req, res) => {
  await db.any(
    "CREATE TABLE IF NOT EXISTS readinglist (id serial primary key, user_id int not null, manga_name text not null, manga_id text not null, status text[], rating text);",
    [true]
  );
  try {
    const reading = await db.any(
      "SELECT * FROM readinglist WHERE user_id=$1 ORDER BY id",
      [req.params.id]
    );
    console.log("retrieved", req.params.id, "reading list");
    res.send(reading);
  } catch (e) {
    console.log("readinglist get", e);
    res.status(400).send({ e });
  }
});

router.post("/reading/:id", async (req, res) => {
  const user_id = req.params.id;
  const manga = {
    id: req.body.id,
    title: req.body.title,
    status: req.body.status,
    rating: req.body.rating,
  };
  console.log([user_id, manga.title, manga.status]);
  try {
    const checkExists = await db.query(
      "SELECT EXISTS(SELECT 1 FROM readinglist WHERE user_id=$1 AND manga_id=$2)",
      [user_id, manga.id]
    );
    if (!checkExists[0].exists) {
      await db.any(
        "INSERT INTO readinglist(user_id, manga_name, manga_id, status, rating) VALUES ($1, $2, $3, $4, $5)",
        [
          user_id,
          manga.title,
          manga.id,
          manga.status,
          manga.status[0] === "Completed" ? manga.rating : "",
        ]
      );
      console.log("added", manga.title, "to reading list");
    }
  } catch (e) {
    console.log("readinglist post", e);
    res.status(400).send({ e });
  }
});

router.delete("/reading/:userid/:mangaid", async (req, res) => {
  const userid = req.params.userid;
  const mangaid = req.params.mangaid;
  console.log(userid, mangaid);
  try {
    await db.query("DELETE FROM readinglist WHERE user_id=$1 AND id=$2", [
      userid,
      mangaid,
    ]);
    console.log("deleted", mangaid, "from reading list");
    res.send({ type: "success" });
  } catch (e) {
    console.log("readmangas delete", e);
    res.status(400).send({ e });
  }
});

router.put("/reading/:userid/:manganame", async (req, res) => {
  const userid = req.params.userid;
  const manga_name = req.params.manganame;
  const manga = {
    name: req.body.name,
    parent: req.body.parent,
    newParent: req.body.newParent,
    status: req.body.status,
    rating: req.body.rating,
  };
  console.log(userid, manga_name, manga.rating);
  try {
    if (isNaN(manga_name)) {
      await db.query(
        "UPDATE readinglist SET status=$1 WHERE user_id=$2 AND manga_name=$3",
        [manga.newParent, userid, manga_name]
      );
      res.send({ type: "success" });
    } else {
      if (manga.rating) {
        await db.query(
          "UPDATE readinglist SET rating=$1 WHERE user_id=$2 AND id=$3",
          [manga.rating, userid, manga_name]
        );
      } else {
        await db.query(
          "UPDATE readinglist SET status=$1 WHERE user_id=$2 AND id=$3",
          [["Currently Reading", manga.status], userid, manga_name]
        );
      }
      console.log("successfully edited", manga_name);
      res.send({ type: "success" });
    }
  } catch (e) {
    console.log("readmangas put", e);
    res.status(400).send({ e });
  }
});

export default router;
