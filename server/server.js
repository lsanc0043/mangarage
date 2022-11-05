import express from "express";
import cors from "cors";
import mangasRouter from "./routes/manga.js";
import usersRouter from "./routes/users.js";

const app = express();
const PORT = 4020;

app.use(cors());
app.use("/manga", mangasRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("hello from server.js in the backend");
});

app.listen(PORT, () => console.log(`sup, you are listening to port ${PORT}`));
