import { Document } from "../models/Document.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import extract from "../utils/textExtractor.js";
import { getEmbeddings } from "../services/embeddingService.js";
import { resourceLimits } from "worker_threads";

const calculateCosineSimilarity = (vectorA, vectorB) => {
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

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
      category: category.toLowerCase(),
      originalName,
    },
    vector: vectorData,
    docUrl: docUrl.url,
  }).catch((err) => {
    console.log("Error in saving data", err);
  });
  console.log("uploaded documetn", document);
  const uploadedDocument = await Document.findById(document._id);

  if (!uploadedDocument) {
    return res
      .status(400)
      .json({ message: "Failed to upload file", status: 400 });
  }

  return res.status(200).json({
    status: 200,
    message: "Document uploaded successfully",
    uploadedDocument,
  });
};

const searchDocument = async (req, res) => {
  try {
    const {
      query,
      page = 1,
      limit = 5,
      category,
      startDate,
      endDate,
    } = req.query;

    if (!query) {
      return res.status(400).json({
        status: 400,
        message: "Search query is required",
      });
    }

    //get vector embedding of search query
    const queryVector = await getEmbeddings(query);
    console.log("query vector", queryVector);
    if (!queryVector) {
      return res.status(400).json({
        status: 400,
        message: "Failed to process search query",
      });
    }

    let filters = {};

    if (category) {
      filters["metadata.category"] = category.toLowerCase();
    }

    //adding date range filter if passed in query
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        filters.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filters.createdAt.$lte = new Date(endDate);
      }
    }

    //calculate offset by limit and page
    const offset = (page - 1) * limit;
    console.log(filters);
    const totalDocs = await Document.countDocuments(filters);
    console.log("total documents", totalDocs);
    const documents = await Document.find(filters)
      .skip(offset)
      .limit(limit)
      .select("text metadata docUrl vector")
      .lean();

    console.log("documents", documents);
    //calculate similarity score with query
    const result = documents.map((doc) => {
      const similarityScore = calculateCosineSimilarity(
        queryVector,
        doc.vector
      );

      return {
        ...doc,
        similarityScore,
      };
    });

    //sorting result on similarity score
    const sortedRes = result.sort(
      (a, b) => b.similarityScore - a.similarityScore
    );

    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      status: 200,
      message: "Search Success",
      data: {
        results: sortedRes,
        pagination: {
          currentPage: parseInt(page),
          totalDocs,
          totalPages,
          hasNextPage,
          hasPrevPage,
          limit: limit,
        },
      },
    });
  } catch (error) {
    console.log("Error occured in search process", error);
    return res.status(500).json({
      status: 500,
      message: "Error in search process",
      error: error.message,
    });
  }
};

export { ingestDocument, searchDocument };
