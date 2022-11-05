import db from "../db/db-connection.js";
import { Router } from "express";

const router = Router();

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

export default router;
