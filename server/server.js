import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import httpProxy from "http-proxy";
import mangasRouter from "./routes/manga.js";
import usersRouter from "./routes/users.js";
import questionsRouter from "./routes/questions.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const apiProxy = httpProxy.createProxyServer();

httpProxy.createProxyServer({ target: "mangarage.onrender.com" }).listen(9000); // See (†)

//
// Create your target server
//
// http
//   .createServer(function (req, res) {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.write(
//       "request successfully proxied!" +
//         "\n" +
//         JSON.stringify(req.headers, true, 2)
//     );
//     res.end();
//   })
//   .listen(9000);

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

app.listen(PORT, () => console.log(`sup, you are listening to port ${PORT}`));
