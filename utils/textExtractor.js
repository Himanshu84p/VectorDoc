import pdfParse from "pdf-parse/lib/pdf-parse.js";
import fs from "fs";

const extract = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const text = data.text;

    return text;
  } catch (error) {
    console.log("error in extracting text", error);
  }
};

export default extract;
