import { Document } from "../models/Document.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import extract from "../utils/textExtractor.js";
import { getEmbeddings } from "../services/embeddingService.js";

const ingestDocument = async (req, res) => {
  const { category } = req.body;
  let docLocalPath;
  // console.log("request file", req.files);
  if (req.files && req.files.docUrl.length > 0) {
    docLocalPath = req.files.docUrl[0].path;
  }
  if (!docLocalPath) {
    return res.status(400).json({ status: 400, message: "document not found" });
  }
  const originalName = req.files.docUrl[0].originalname;
  const docUrl = await uploadOnCloudinary(docLocalPath);

  if (!docUrl) {
    return res
      .status(400)
      .json({ status: 400, message: "Error in uploading document on cloud" });
  }
  // console.log("document cloudinary url", docUrl);

  //extracting text from pdf using pdf-parse
  const extractedText = await extract(docLocalPath);
  // console.log("extracted text", extractedText);
  if (!extractedText) {
    return res
      .status(400)
      .json({ status: 400, message: "Unable to fetch text." });
  }
  //removing local file after uploading on the cloud
  fs.unlinkSync(docLocalPath);

  //getting vectors of extracted text
  const vectorData = await getEmbeddings(extractedText);

  if (!vectorData) {
    return res
      .status(400)
      .json({ status: 400, message: "Vector conversion failed" });
  }

  // console.log("vectorized data", vectorData);

  const document = await Document.create({
    text: extractedText,
    metadata: {
      category: category,
      originalName: originalName,
    },
    vector: vectorData,
    docUrl: docUrl.url,
  });

  const uploadedDocument = await Document.findById(document._id);

  if (!uploadedDocument) {
    return res
      .status(400)
      .json({ message: "Failed to upload file", status: 400 });
  }

  return res
    .status(200)
    .json({ status: 200, message: "Document uploaded successfully" });
};

export { ingestDocument };
