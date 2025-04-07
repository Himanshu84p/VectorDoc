import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import multer from "multer";
import { Document } from "./models/Document.js";
import { ConnectDB } from "./lib/db.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

ConnectDB();


app.listen(port, () => {
  console.log("port is listening");
});
