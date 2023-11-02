const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  price: { type: Number, min: 0, required: true },
  image: String,
  description: String,
  location: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const r = await Review.deleteMany({ _id: { $in: doc.reviews } });
    console.log("Reviews deleted:", r);
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
