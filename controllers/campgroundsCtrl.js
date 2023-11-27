if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const Campground = require("../models/campground.js");
const { cloudinary } = require("../utilities/cloudinary.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding.js");
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });

module.exports.index = async function (req, res, next) {
  const camps = await Campground.find({});
  res.render("./campgrounds/index.ejs", { camps });
};

module.exports.getNewForm = function (req, res) {
  res.render("./campgrounds/new.ejs");
};

module.exports.postNewCamp = async function (req, res, next) {
  const geoData = await geocoder.forwardGeocode({ query: req.body.campground.location, limit: 1 }).send();

  req.body.campground.geometry = geoData.body.features[0].geometry;

  req.body.campground.image = req.files.map((f) => ({
    path: f.path,
    filename: f.filename,
  }));

  const camp = new Campground(req.body.campground);
  camp.author = req.user._id;
  await camp.save();
  req.flash("newCampground", "Successfully made a new campground");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.getOneCamp = async function (req, res, next) {
  const id = req.params.id;
  const camp = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author", select: "username" },
    })
    .populate("author");
  res.render("./campgrounds/show.ejs", { camp });
};

module.exports.deleteOneCamp = async function (req, res, next) {
  const id = req.params.id;
  const r = await Campground.findByIdAndDelete(id);
  req.flash("campgroundDeleted", `Campground was delete`);
  res.redirect("/campgrounds");
};

module.exports.getEditForm = async function (req, res, next) {
  const id = req.params.id;
  const camp = await Campground.findById(id);
  res.render("./campgrounds/edit.ejs", { camp });
};

module.exports.putEditOne = async function (req, res, next) {
  const id = req.params.id;
  const camp = await Campground.findById(id);

  if (req.body?.imageDelete) {
    // await camp.updateOne({ $pull: { image: { filename: { $in: req.body.imageDelete } } } });
    cloudinary.api.delete_resources(req.body.imageDelete, { type: "upload", resource_type: "image" }).then(console.log);
    // cloudinary.uploader.destroy(req.body.imageDelete[0]);
    camp.image.map((img, i) => {
      req.body.imageDelete.includes(img.filename) ? camp.image.splice(i, 1) : "";
    });
  }

  const imgsArr = req.files.map((f) => ({
    path: f.path,
    filename: f.filename,
  }));

  const { campground } = req.body;
  campground.image = [...camp.image, ...imgsArr];

  await camp.updateOne(campground);
  console.log(camp);
  // await Campground.validate({ price: campground.price }, ["price"]);
  // await Campground.findByIdAndUpdate(id, campground);
  res.redirect(`/campgrounds/${id}`);
};
