module.exports = function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((e) => next(e));
  };
};