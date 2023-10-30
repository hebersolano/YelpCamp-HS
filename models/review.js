const { default: mongoose, Schema } = require("mongoose");

const reviewSchema = new Schema({
  body: String,
  rating: Number,
});

module.exports = mongoose.model("Review", reviewSchema);
