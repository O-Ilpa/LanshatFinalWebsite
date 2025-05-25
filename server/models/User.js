import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  favorites: {
    type: [String],
    default: [],
  },
  companyName: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    enum: ["Mr", "Ms"],
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  customerNumber: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

const User = mongoose.model("Users", UserSchema);

export default User;
