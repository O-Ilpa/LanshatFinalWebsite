import fs from 'fs';
console.log("Does .env exist?", fs.existsSync('./.env'));
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
console.log("ENV CHECK", {
  ZOHO_USER_SALES: process.env.ZOHO_USER_SALES,
  ZOHO_PASS_SALES: process.env.ZOHO_PASS_SALES ? "***" : "missing",
  ZOHO_USER_INFO: process.env.ZOHO_USER_INFO,
  ZOHO_PASS_INFO: process.env.ZOHO_PASS_INFO ? "***" : "missing"
});
import express from "express";
import authRouter from "./routers/auth.js";
import mongoose from "mongoose";
import cors from "cors";
import machineRouter from "./routers/machines.js";
import inquiryRouter from "./routers/inquiry.js";
import egyptMaterialsRouter from "./routers/egyptMaterials.js";
import adminRouter from "./routers/admin.js";
import searchRouter from './routers/search.js';

const app = express();

app.use(express.json());
const allowedOrigins = [
  process.env.LOCAL_FRONT_ENDPOINT,
  "https://6827b3ca212e6d97adbce016--unique-tarsier-c040fd.netlify.app",
  process.env.FRONT_END_ENDPOINT,
  "http://192.168.1.5:5173"
];

// app.use(
//   cors({
//     origin: 'http://192.168.1.5:5173',
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRouter);
app.use("/api/machines", machineRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/egypt-materials", egyptMaterialsRouter);
app.use("/api/admin", adminRouter);
app.use('/api/search', searchRouter);

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error.name));
db.once("open", () => console.log("connected to mongoose"));
app.listen(process.env.PORT || 5000);
