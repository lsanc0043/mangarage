import db from "../db/db-connection.js";
import { Router } from "express";

const router = Router();

const validLogin = [0]; // checks for valid login [0] = false, [1] = true

// retrieves all users and displays, all users have encrypted passwords
router.get("/", async (req, res) => {
  try {
    const allUsers = await db.any(
      "SELECT id, username, email, last_login FROM users ORDER BY id",
      [true]
    );
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
      console.log("success");
    } else {
      validLogin[0] = 0;
      res.status(200).send({ type: "fail" });
      console.log("fail");
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
  try {
    const newUser = await db.any(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, crypt($3, gen_salt('bf')));",
      [user.username, user.email, user.password]
    );
  } catch (e) {
    console.log("user register", e);
    res.status(400).send({ e });
  }
});

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const login = req.body.last_login;
  try {
    await db.any("UPDATE users SET last_login=$1 WHERE id=$2", [login, userId]);
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
  } catch (e) {
    console.log(e);
    res.status(400).send({ e });
  }
});

// retrieves readmangas junction table info, filtered and separated by user id
router.get("/read/:id", async (req, res) => {
  try {
    const readMangas = await db.any(
      "SELECT * FROM readmangas where user_id=$1 ORDER BY manga_id",
      [req.params.id]
    );
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
      console.log("added", user_read.manga);
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
  console.log(userid, mangaid);
  try {
    await db.query("DELETE FROM readmangas WHERE user_id=$1 AND manga_id=$2", [
      userid,
      mangaid,
    ]);
    res.send({ type: "success" });
  } catch (e) {
    console.log("readmangas delete", e);
    res.status(400).send({ e });
  }
});

export default router;
