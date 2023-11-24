const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const { cloudinary } = require("../utilities/cloudinary.js");

const ImgSchema = new Schema({ path: String, filename: String });

// "https://res.cloudinary.com/dswgihnab/image/upload/v1700496837/yelp-camp/zx90lsh5hciqvdulceaj.jpg";
ImgSchema.virtual("thumbnail").get(function () {
  return this.path.replace("/upload", "/upload/h_200,w_200,c_fill");
  // return await cloudinary.url(this.filename, { height: 250, crop: "scale" });
});

const CampgroundSchema = new Schema({
  title: String,
  price: { type: Number, min: 0, required: true },
  image: [ImgSchema],
  description: String,
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  location: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const r = await Review.deleteMany({ _id: { $in: doc.reviews } });
    console.log("Reviews deleted:", r);
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
