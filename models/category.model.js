const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    kind: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
