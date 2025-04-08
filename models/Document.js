import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
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
    docUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Document = mongoose.model("Document", documentSchema);
