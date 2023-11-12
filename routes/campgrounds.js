const express = require("express");
const router = express.Router({ mergeParams: true });

// helpers
const catchAsync = require("../utilities/catchAsync.js");
const ServerError = require("../utilities/ServerError.js");
const { validateCampground } = require("../utilities/validators.js");
const isAuthenticated = require("../utilities/isAuthenticated.js");

// DB models
const Campground = require("../models/campground.js");

const isAuthor = async function (req, res, next) {
  const id = req.params.id;
  const camp = await Campground.findById(id);
  if (!camp.author._id.equals(req.user._id)) {
    req.flash("error", "You do not have permission to perform that action");
    res.redirect(`/campgrounds/${id}`);
    return;
  }
  next();
};

router.get(
  "/",
  catchAsync(async function (req, res, next) {
    const camps = await Campground.find({});
    res.render("./campgrounds/index.ejs", { camps });
  })
);

router.get("/new", isAuthenticated, function (req, res) {
  res.render("./campgrounds/new.ejs");
});

router.post(
  "/",
  isAuthenticated,
  validateCampground,
  catchAsync(async function (req, res, next) {
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    req.flash("newCampground", "Successfully made a new campground");
    await camp.save();
    console.log(camp);
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.delete(
  "/:id",

  isAuthenticated,

  isAuthor,

  catchAsync(async function (req, res, next) {
    const id = req.params.id;
    const r = await Campground.findByIdAndDelete(id);
    console.log("Campground deleted:", r);
    req.flash("campgroundDeleted", `Campground was delete`);
    res.redirect("/campgrounds");
  })
);

router.put(
  "/:id",

  validateCampground,

  isAuthor,

  catchAsync(async function (req, res, next) {
    const id = req.params.id;
    const { campground } = req.body;
    // await Campground.validate({ price: campground.price }, ["price"]);
    await Campground.findByIdAndUpdate(id, campground, {
      runValidators: true,
    });
    res.redirect(`/campgrounds/${id}`);
  })
);

router.get(
  "/:id/edit",

  isAuthenticated,

  isAuthor,

  catchAsync(async function (req, res, next) {
    const id = req.params.id;
    const camp = await Campground.findById(id);

    console.log("Editing:", camp);
    res.render("./campgrounds/edit.ejs", { camp });
  })
);

router.get(
  "/:id",

  catchAsync(async function (req, res, next) {
    const id = req.params.id;
    const camp = await Campground.findById(id)
      .populate("reviews")
      .populate("author");
    res.render("./campgrounds/show.ejs", { camp });
  })
);

module.exports = router;
