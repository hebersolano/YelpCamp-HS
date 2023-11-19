module.exports = function (req, res, next) {
  if (!req.isAuthenticated()) {
    res.locals.redirect = req.session.redirectTo[0];
    req.flash("error", "You need to login");
    res.redirect("/login");
    return;
  }
  next();
};
