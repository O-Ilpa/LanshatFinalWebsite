import express from "express";
import Machine from "../models/machines.js";
import verifyMiddleWare from "./verifyMiddleWare.js";
import cloudinary from "../utils/cloudinary.js";
import fetch from 'node-fetch';

const app = express();

app.use(express.json());
const router = express.Router();

router.post("/add", verifyMiddleWare, async (req, res) => {
  try {
    const {
      name,
      machineType,
      manufacturer,
      model,
      yearOfConstruction,
      condition,
      description,
      images,
      location,
      coords,
    } = req.body;
    const { featured = false } = req.body;

    const newMachine = new Machine({
      name: name,
      machineType: machineType,
      manufacturer: manufacturer,
      model: model,
      yearOfConstruction: yearOfConstruction,
      condition: condition,
      description: description,
      images: images.map((image) => ({
        url: image.url,
        public_id: image.public_id,
      })),
      location: location,
      coords: coords,
      featured: featured,
    });

    await newMachine.save();
    console.log(newMachine);
    res
      .status(200)
      .json({ success: true, message: "Machine Created Succefully" });
  } catch (err) {
    res.json({
      success: false,
      message:
        "error creating Machine: please enter all the required fields: " + err,
    });
  }
});

router.get("/get", async (req, res) => {
  try {
    const { featured } = req.query;
    let filter = {};
    if (featured === "true") {
      filter.featured = true;
    }
    const Machines = await Machine.find(filter);
    return res.status(200).json({
      success: true,
      message: "Machines Fetched Succefully",
      machines: Machines,
    });
  } catch (err) {
    res.json({ success: true, message: "Couldn't Fetch Properties: " + err });
  }
});
router.delete("/del/:id", verifyMiddleWare, async (req, res) => {
  console.time("deleting Machine");
  try {
    const { deletedImages } = req.body;
    if (deletedImages && deletedImages.length != 0) {
      for (const public_id of deletedImages) {
        await cloudinary.uploader.destroy(public_id);
      }
    }
    const delMachineId = req.params.id;
    await Machine.findByIdAndDelete(delMachineId);
    res.json({ success: true, message: "machine deleted succefully" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "err deleting machine: " + err });
  }
  console.timeEnd("deleting Machine");
});
router.put("/edit/:id", async (req, res) => {
  try {
    const {
      name,
      machineType,
      manufacturer,
      model,
      yearOfConstruction,
      condition,
      description,
      price,
      location,
      coords,
      specialInfo,
      images,
      deletedImages,
      featured,
    } = req.body;
    if (deletedImages && deletedImages.length != 0) {
      for (const public_id of deletedImages) {
        await cloudinary.uploader.destroy(public_id);
      }
    }
    const { id } = req.params;
    const updatedMachine = await Machine.findByIdAndUpdate(id, {
      name,
      machineType,
      manufacturer,
      model,
      yearOfConstruction,
      condition,
      description,
      price,
      location,
      coords,
      specialInfo,
      featured,
      images: images.map((image) => ({
        url: image.url,
        public_id: image.public_id,
      })),
    });
    res.json({ success: true, message: "updated Succefully" });
  } catch (err) {
    res.json({ success: false, message: "err updating machine: " + err });
  }
});
router.get("/show/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const machine = await Machine.findById(id);
    if (machine) {
      res.json({
        success: true,
        message: "found machine",
        machine: machine,
      });
    } else {
      res.status(200).json({ success: false, message: "404 Not Found" });
    }
  } catch (err) {
    res.json({ success: false, message: err });
  }
});
router.get("/download", async (req, res) => {
  const machines = await Machine.find({});
  res.json({
    success: true,
    message: "all Machines fetched",
    machines: machines,
  });
});
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const machine = await Machine.findOne({ slug });
    if (!machine) {
      return res
        .status(404)
        .json({ success: false, message: "Machine not found" });
    }
    res.json({ success: true, machine });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching machine by slug: " + err,
    });
  }
});
router.get("/featured", async (req, res) => {
  try {
    const Machines = await Machine.find({ featured: true });
    return res.status(200).json({
      success: true,
      message: "Featured Machines Fetched Successfully",
      machines: Machines,
    });
  } catch (err) {
    res.json({ success: false, message: "Couldn't Fetch Featured Machines: " + err });
  }
});

export default router;
