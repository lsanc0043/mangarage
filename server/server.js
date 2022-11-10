import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mangasRouter from "./routes/manga.js";
import usersRouter from "./routes/users.js";
import questionsRouter from "./routes/questions.js";

const app = express();
const PORT = 4020;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/manga", mangasRouter);
app.use("/users", usersRouter);
app.use("/questions", questionsRouter);

app.get("/", (req, res) => {
  res.send("hello from server.js in the backend");
});

app.listen(PORT, () => console.log(`sup, you are listening to port ${PORT}`));
