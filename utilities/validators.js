const ServerError = require("./ServerError");

const Joi = require("joi");

const campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().required(),
  }).required(),
});

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
