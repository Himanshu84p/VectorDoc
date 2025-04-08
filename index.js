import dotenv from "dotenv";
import { ConnectDB } from "./lib/db.js";
import app from "./app.js";

dotenv.config({ path: ".env" });
console.log("starting");

await ConnectDB()
  .then(() => {
    app.on("error", (err) => {
      console.error("Error Occured while running the server", err);
    });

    app.listen(process.env.PORT, () => {
      console.log(`port is listening ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Server error", err);
  });
