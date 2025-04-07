import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const client = new MongoClient(process.env.MONGO_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function ConnectDB() {
  try {
    await client.connect();
    console.log("db connected !!");
  } catch (error) {
    console.log("error in db connection", error);
  }
}
