import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
// Dot Env Config

dotenv.config();

// Objects
const app = express();

// MiddleWars
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.get("/", function (req, res, next) {
  res.status(200).send("<h1>hello I am HTML text</h1>");
});
const Port = process.env.PORT || 8080;

app.listen(Port, function (req, res) {
  console.log(`listning on port no ${Port}`.bgBlack.white);
});
