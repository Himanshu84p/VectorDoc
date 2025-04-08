import axios from "axios";
import "dotenv/config";

const HF_TOKEN = process.env.HF_TOKEN;

export const getEmbeddings = async (text) => {
  const res = await axios.post(
    process.env.HF_API_URL,
    {
      inputs: text,
      options: {
        wait_for_modal: true,
      },
    },
    {
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
    }
  );
  if (!res.data || !Array.isArray(res.data)) {
    throw new Error("Invalid response from embedding API");
  }
  console.log("embedding from hugging face", res);
  return res.data;
};
