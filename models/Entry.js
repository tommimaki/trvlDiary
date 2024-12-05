import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  notes: {
    type: String,
  },
  imageUrl: { type: String },
  publicId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Entry || mongoose.model("Entry", EntrySchema);
