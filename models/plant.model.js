const mongoose = require("mongoose");
const URLSlug = require("mongoose-slug-generator");

const plantSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      slug: "title",
      unique: true,
    },
    keyImage: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    inStock: {
      type: Number,
      default: 0,
    },
    productId: {
      type: String,
      default: null,
    },
    disCost: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: {
      type: Array,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    avgRating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.plugin(URLSlug);

module.exports = mongoose.models.Plant || mongoose.model("Plant", plantSchema);
