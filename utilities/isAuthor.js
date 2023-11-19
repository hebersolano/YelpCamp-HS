const Campground = require("../models/campground.js");
const Review = require("../models/review");

module.exports.isAuthorCampground = async function (req, res, next) {
  const id = req.params.id;
  const camp = await Campground.findById(id);
  if (!camp.author._id.equals(req.user._id)) {
    req.flash("error", "You do not have permission to perform that action");
    res.redirect(`/campgrounds/${id}`);
    return;
  }
  next();
};

module.exports.isAuthorReview = async function (req, res, next) {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  console.log("review", review);
  if (!review.author._id.equals(req.user._id)) {
    req.flash("error", "You do not have permission to perform that action");
    res.redirect(`/campgrounds/${id}`);
    return;
  }
  next();
};
