import { Router } from "express";
import {
  ingestDocument,
  searchDocument,
} from "../controllers/document.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/ingest")
  .post(upload.fields([{ name: "docUrl", maxCount: 1 }]), ingestDocument);

router.route("/search").get(searchDocument);

export default router;
