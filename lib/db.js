import mongoose from "mongoose";

const connectOptions = {
  serverSelectionTimeoutMS: 20000,
  socketTimeoutMS: 45000,
};

export const ConnectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URL,
      connectOptions
    );
    console.log(`MongoDB Connected: ${connection.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    return connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
