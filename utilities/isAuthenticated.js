module.exports = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You need to login");
    res.redirect("/login");
    return;
  }
  next();
};
