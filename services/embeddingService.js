import axios from "axios";
import "dotenv/config";

const HF_TOKEN = process.env.HF_TOKEN;

export const getEmbeddings = async (text) => {
  const res = await axios.post(
    "https://api-inference.huggingface.co/embeddings/sentence-transformers/all-MiniLM-L6-v2",
    { input: text },
    {
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
    }
  );
  console.log("embedding from hugging face", res);
  return res.data.embedding;
};
