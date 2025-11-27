const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["guest", "host"],
    default: "guest",
  },
  favourite: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Home",
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
