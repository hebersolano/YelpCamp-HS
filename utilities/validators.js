const { campgroundSchema, reviewSchema } = require("./validationSchemas");
const ServerError = require("../utilities/ServerError.js");

module.exports.validateCampground = function (req, res, next) {
  // Joi validation star
  const { error } = campgroundSchema.validate(req.body);
  console.log(error);
  if (error) {
    const msj = error.details.map((err) => err.message).join(", ");
    throw new ServerError(msj, 400);
  }
  // Joi end validation
  next();
};

module.exports.validateReview = function (req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msj = error.details.map((err) => err.message).join(", ");
    throw new ServerError(msj, 400);
  }
  next();
};
