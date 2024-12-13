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
  imageUrl: {
    type: String,
  },
  publicId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  pictureDate: {
    type: Date, // Picture's date from metadata
  },
  latitude: {
    type: Number, // Latitude coordinate
  },
  longitude: {
    type: Number, // Longitude coordinate
  },
  locationName: {
    type: String, // Human-readable location
    default: "Unknown Location",
  },
});

// Prevent model overwriting in development
const Entry = mongoose.models.Entry || mongoose.model("Entry", EntrySchema);
console.log("mongoose.models.Entry:", mongoose.models.Entry);

export default Entry;
