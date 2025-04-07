import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  metadata: {
    category: String,
    originalName: String,
    uploadedAt: { type: Date, default: Date.now },
  },
  vector: [Number],
});

export const Document = mongoose.model("Document", documentSchema);
