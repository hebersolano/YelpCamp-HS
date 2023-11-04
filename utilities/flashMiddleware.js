class flashOjt {
  constructor(type, msj, alert) {
    this.type = type;
    this.msj = msj;
    this.alert = alert;
  }
}

module.exports = function (req, res, next) {
  const comment = req.flash("newComment");
  const campground = req.flash("newCampground");
  console.log(req.flash);
  console.log(req.flash("newCampground"));

  let flashState = new flashOjt("", "", "");
  if (comment != 0) {
    flashState = new flashOjt("newComment", comment.join(), "success");
  }
  if (campground.length != 0) {
    flashState = new flashOjt("newCampground", campground.join(), "success");
  }
  if (req.flash("error").length != 0) {
    flashState = new flashOjt("error", req.flash("error"), "warning");
  }

  console.log(flashState);

  res.locals.flashState = flashState;
  next();
};
