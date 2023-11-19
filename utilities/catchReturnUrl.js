module.exports = function catchReturnUrl(req, res, next) {
  res.locals.redirectTo = [...req.session.redirectTo];
  if (req.session.redirectTo[1] !== "/login") {
    res.locals.redirect = req.session.redirectTo[1];
  } else {
    res.locals.redirect = req.session.redirectTo[0];
  }

  next();
};
