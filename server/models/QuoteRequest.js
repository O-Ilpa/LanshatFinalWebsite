import mongoose from "mongoose";

const QuoteRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  message: String,
  items: [
    {
      _id: String,
      name: String,
      machineType: String,
      type: String,
      manufacturer: String,
      // Add more fields as needed
    }
  ],
  file: String, // filename or URL if you want to store it
}, { timestamps: true });

export default mongoose.model("QuoteRequest", QuoteRequestSchema); 