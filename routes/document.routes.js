import { Router } from "express";
import { ingestDocument } from "../controllers/document.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/ingest")
  .post(upload.fields([{ name: "docUrl", maxCount: 1 }]), ingestDocument);

export default router;
