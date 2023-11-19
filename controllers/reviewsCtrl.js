const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports = {
  postNew: async function (req, res) {
    req.flash("newComment", "New comment added");
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await Promise.all([camp.save(), review.save()]);
    res.redirect(`/campgrounds/${camp._id}`);
  },

  deleteOne: async function (req, res) {
    const { id, reviewId } = req.params;
    await Promise.all([
      Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }),
      Review.findByIdAndDelete(reviewId),
    ]);
    req.flash("commentDeleted", "Comment was deleted");
    res.redirect(`/campgrounds/${id}`);
  },
};
