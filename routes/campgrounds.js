const express = require("express");
const router = express.Router({ mergeParams: true });

// helpers
const catchAsync = require("../utilities/catchAsync.js");
const ServerError = require("../utilities/ServerError.js");
const { validateCampground } = require("../utilities/validators.js");

// DB models
const Campground = require("../models/campground.js");

router.get(
  "/",
  catchAsync(async function (req, res, next) {
    const camps = await Campground.find({});
    res.render("./campgrounds/index.ejs", { camps });
  })
);

router.get("/new", function (req, res) {
  res.render("./campgrounds/new.ejs");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async function (req, res, next) {
    const { campground } = req.body;

    if (!campground) throw new ServerError("Invalid form data", 400);
    const camp = new Campground(campground);
    await camp.save();
    console.log(camp);
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async function (req, res, next) {
    const id = req.params.id;
    const r = await Campground.findByIdAndDelete(id);
    console.log("Campground deleted:", r);
    res.redirect("/campgrounds");
  })
);

router.put(
  "/:id",
  validateCampground,
  catchAsync(async function (req, res, next) {
    const id = req.params.id;
    const { campground } = req.body;
    console.log(campground);
    // await Campground.validate({ price: campground.price }, ["price"]);
    await Campground.findByIdAndUpdate(id, campground, { runValidators: true });

    res.redirect(`/campgrounds/${id}`);
  })
);

router.get(
  "/:id/edit",
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
    const camp = await Campground.findById(id).populate("reviews");
    res.render("./campgrounds/show.ejs", { camp });
  })
);

module.exports = router;
