const mongoose = require("mongoose");
const homeSchema = new mongoose.Schema({
  houseName: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  photo: String,
  pdf: String,
  rating: {
    type: Number,
    required: true,
  },
});
// homeSchema.pre("findOneAndDelete", function (next) {
//   const homeId = this.getQuery()._id;
//   mongoose
//     .model("Favourite")
//     .deleteMany({ homeId: homeId })
//     .then(() => next())
//     .catch((err) => next(err));
// });
module.exports = mongoose.model("Home", homeSchema);
