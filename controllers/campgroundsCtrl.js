const Campground = require("../models/campground.js");
const { cloudinary } = require("../utilities/cloudinary.js");

module.exports.index = async function (req, res, next) {
  const camps = await Campground.find({});
  res.render("./campgrounds/index.ejs", { camps });
};

module.exports.getNewForm = function (req, res) {
  res.render("./campgrounds/new.ejs");
};

module.exports.postNewCamp = async function (req, res, next) {
  req.body.campground.image = req.files.map((f) => ({
    path: f.path,
    filename: f.filename,
  }));
  const camp = new Campground(req.body.campground);
  camp.author = req.user._id;
  req.flash("newCampground", "Successfully made a new campground");
  await camp.save();
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
  console.log("PutEditOne Camp body:", req.body);
  const id = req.params.id;
  const camp = await Campground.findById(id);
  if (req.body?.imageDelete) {
    cloudinary.api.delete_resources(req.body.imageDelete, { type: "upload", resource_type: "image" }).then(console.log);
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
