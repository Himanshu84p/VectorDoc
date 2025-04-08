import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//importing routes
import documentRouter from "./routes/document.routes.js";

app.use("/api/v1", documentRouter);

export default app;
