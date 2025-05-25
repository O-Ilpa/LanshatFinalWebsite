import express from "express";
import EgyptMaterial from "../models/egyptMaterial.js";
// import { verifyAdmin } from "./verifyMiddleWare"; // Uncomment if you have admin middleware

const router = express.Router();

// GET all Egypt materials (public)
router.get("/", async (req, res) => {
  try {
    const materials = await EgyptMaterial.find().sort({ createdAt: -1 });
    res.json({ success: true, materials });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST new Egypt material (admin only)
// router.post("/", verifyAdmin, async (req, res) => {
router.post("/", async (req, res) => {
  try {
    const { name, description, image, type, additionalInfo } = req.body;
    const material = new EgyptMaterial({
      name,
      description,
      image,
      type,
      additionalInfo,
    });
    await material.save();
    res.status(201).json({ success: true, material });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid data" });
  }
});

// PUT update Egypt material by ID (admin only)
// router.put("/:id", verifyAdmin, async (req, res) => {
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const material = await EgyptMaterial.findByIdAndUpdate(id, update, { new: true });
    if (!material) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, material });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid data" });
  }
});

export default router; 