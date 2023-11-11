module.exports = function catchReturnUrl(req, res, next) {
  if (req.session.returnTo) {
    res.locals.redirectTo = req.session.returnTo;
  }
  next();
};
