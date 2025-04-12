import mongoose from "mongoose";

const cropLogSchema = new mongoose.Schema({
  input: {
    pH: Number,
    moisture: Number,
    temperature: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
  },
  recommendedCrops: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CropLog", cropLogSchema);
