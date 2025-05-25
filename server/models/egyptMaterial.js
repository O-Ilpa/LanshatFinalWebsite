import mongoose from "mongoose";

const EgyptMaterialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [
    {
      url: String,
      public_id: String,
    },
  ],
  type: { type: String, required: true },
  supplier: { type: String },
  availableQuantity: { type: String },
  certifications: [{ type: String }],
  featured: { type: Boolean, default: false },
  additionalInfo: { type: Map, of: String, default: {} },
}, { timestamps: true });

export default mongoose.model("EgyptMaterial", EgyptMaterialSchema); 