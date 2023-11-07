class flashOjt {
  constructor(type, msj, alert, place) {
    this.type = type;
    this.msj = msj;
    this.alert = alert;
    this.place = place;
  }
}

module.exports = function (req, res, next) {
  const comment = req.flash("newComment");
  const campground = req.flash("newCampground");
  const commentDeleted = req.flash("commentDeleted");
  const campgroundDeleted = req.flash("campgroundDeleted");

  let flashState;

  if (comment != 0) {
    flashState = new flashOjt(
      "newComment",
      comment.join(),
      "success",
      "comments"
    );
  }
  if (campground.length != 0) {
    flashState = new flashOjt(
      "newCampground",
      campground.join(),
      "success",
      "campgrounds"
    );
  }
  if (commentDeleted.length != 0) {
    flashState = new flashOjt(
      "commentDeleted",
      commentDeleted.join(),
      "danger",
      "comments"
    );
  }
  if (campgroundDeleted.length != 0) {
    flashState = new flashOjt(
      "campgroundDeleted",
      campgroundDeleted.join(),
      "danger",
      "campgrounds"
    );
  }

  if (!flashState) flashState = new flashOjt("", "", "", "");
  console.log(flashState);

  res.locals.flashState = flashState;
  next();
};
