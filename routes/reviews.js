const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utilities/catchAsync.js");
const { validateReview } = require("../utilities/validators.js");

router.post(
  "/:id/reviews",
  validateReview,
  catchAsync(async function (req, res, next) {
    req.flash("newComment", "New comment added");
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await Promise.all([camp.save(), review.save()]);
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.delete(
  "/:id/reviews/:reviewId",
  catchAsync(async function (req, res, next) {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("commentDeleted", "Comment was deleted");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
