const ServerError = require("./ServerError");
const sanitizeHTML = require("sanitize-html");

const baseJoi = require("joi");

const extension = function (Joi) {
  return {
    type: "string",
    base: Joi.string(),
    messages: { "string.escapeHTML": "{{#label}} must not include HTML" },
    rules: {
      escapeHTML: {
        validate(value, helper) {
          const clean = sanitizeHTML(value, { allowedTags: [], allowedAttributes: {} });
          if (clean !== value) return helper.error("string.escapeHTML", value);
          return clean;
        },
      },
    },
  };
};

const Joi = baseJoi.extend(extension);

const campgroundSchema = Joi.object({
  title: Joi.string().required().escapeHTML(),
  location: Joi.string().required().escapeHTML(),
  price: Joi.number().required().min(0),
  description: Joi.string().required().escapeHTML(),
}).required();
// image: [{ url: Joi.string(), filename: Joi.string() }],

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});

module.exports.validateCampground = function (req, res, next) {
  const { campground } = req.body;
  // Joi validation star
  const { error } = campgroundSchema.validate(campground);
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
