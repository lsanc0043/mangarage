import db from "../db/db-connection.js";
import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const mangaInfo = await db.any(
      "SELECT id, title, year, author, characters FROM manga ORDER BY title",
      [true]
    );
    res.send(mangaInfo);
  } catch (e) {
    console.log(e);
    res.status(400).send({ e });
  }
});

export default router;
