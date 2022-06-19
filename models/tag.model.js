const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
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
module.exports = mongoose.models.Tag || mongoose.model("Tag", tagSchema);
