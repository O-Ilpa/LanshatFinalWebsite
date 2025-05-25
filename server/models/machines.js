import mongoose from "mongoose";

const machineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    machineType: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    yearOfConstruction: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    specialInfo: {
      type: String,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
    },
    offerId: {
      type: String,
      unique: true,
      index: true,
    },
    outOfStock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add this helper above the schema definition
function randomId(length = 6) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

function randomOfferId(length = 12) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

machineSchema.pre("save", async function (next) {
  if (
    !this.isModified("name") &&
    !this.isModified("yearOfConstruction") &&
    this.slug
  ) {
    return next();
  }
  const baseSlug = slugify(`${this.name}`);
  let slug = `${baseSlug}-${randomId()}`;
  const Machine = this.constructor;
  while (await Machine.findOne({ slug })) {
    slug = `${baseSlug}-${randomId()}`;
  }
  this.slug = slug;
  // Generate offerId if not present
  if (!this.offerId) {
    let offerId = randomOfferId();
    while (await Machine.findOne({ offerId })) {
      offerId = randomOfferId();
    }
    this.offerId = offerId;
  }
  next();
});

export default mongoose.model("Machine", machineSchema);
