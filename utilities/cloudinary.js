// FILES STORAGE
const multer = require("multer");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "yelp-camp",
    clientAllowedFormats: ["jpeg", "jpg", "png", "webp"],
    // format: async (req, file) => "png", // supports promises as well
    // public_id: (req, file) => "computed-filename-using-request",
  },
});

const parser = multer({ storage: storage });
module.exports = parser;
