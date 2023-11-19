const ServerError = require("./ServerError");

const Joi = require("joi");

const campgroundSchema = Joi.object({
  title: Joi.string().required(),
  location: Joi.string().required(),
  price: Joi.number().required().min(0),
  description: Joi.string().required(),
});
// image: [{ url: Joi.string(), filename: Joi.string() }],

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().required(),
  }).required(),
});

module.exports.validateCampground = function (req, res, next) {
  const { campground } = req.body;
  console.log(campground);
  // Joi validation star
  const { error } = campgroundSchema.validate(campground);
  console.log(error);
  if (error) {
    const msj = error.details.map((err) => err.message).join(", ");
    throw new ServerError(msj, 400);
  }
  // Joi end validation
  next();
};

module.exports.validateReview = function (req, res, next) {
  console.log(req.body);
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msj = error.details.map((err) => err.message).join(", ");
    throw new ServerError(msj, 400);
  }
  next();
};
