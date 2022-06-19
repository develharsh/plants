const mongoose = require("mongoose");
const { isEmail } = require("../utils/validator");

const userDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    company: {
      type: String,
    },
    address: {
      state: { type: String },
      city: { type: String },
      pincode: { type: String },
      address: { type: String },
    },
  },
  { timestamps: true }
);

userDataSchema.path("email").validate(function (email) {
  return email ? isEmail(email) : true;
}, "Invalid email was provided");
module.exports =
  mongoose.models.Userdata || mongoose.model("Userdata", userDataSchema);
