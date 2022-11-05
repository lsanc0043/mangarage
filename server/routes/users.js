import db from "../db/db-connection.js";
import { Router } from "express";

const router = Router();

const validLogin = [0]; // checks for valid login [0] = false, [1] = true

// retrieves all users and displays, all users have encrypted passwords
router.get("/", async (req, res) => {
  try {
    const allUsers = await db.any("SELECT * FROM users", [true]);
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

export default router;