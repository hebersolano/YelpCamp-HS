const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utilities/catchAsync.js");
const { validateReview } = require("../utilities/validators.js");
const isAuthenticated = require("../utilities/isAuthenticated.js");
const { isAuthorReview } = require("../utilities/isAuthor.js");

const reviewsCtrl = require("../controllers/reviewsCtrl.js");

router.post(
  "/:id/reviews",
  isAuthenticated,
  validateReview,
  catchAsync(reviewsCtrl.postNew)
);

router.delete(
  "/:id/reviews/:reviewId",
  isAuthenticated,
  isAuthorReview,
  catchAsync(reviewsCtrl.deleteOne)
);

module.exports = router;
