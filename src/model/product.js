
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    audioUrl: { type: String, required: true },  // Link đến file âm thanh
    lyrics: { type: String, required: true },    // Lời bài hát
 },
  {timestamps: true, versionKey: false}
);
export default mongoose.model("Product", productSchema)