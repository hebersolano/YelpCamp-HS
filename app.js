const Express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/capmground");
const Review = require("./models/review");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const catchAsync = require("./utilities/catchAsync.js");
const ServerError = require("./utilities/ServerError.js");
const {
  campgroundSchema,
  reviewSchema,
} = require("./utilities/validationSchemas");
const { clearCache } = require("ejs");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => console.log("Mongo db connected!"))
  .catch((err) => console.log("Error connection mongo db:", err));

const db = mongoose.connection;
db.on("error", (err) => {
  console.log("Error mongo db connection:", err);
});
db.once("open", function () {
  console.log("DB connected");
});

const app = new Express();
// EXPRESS SETS AND MIDDLEWARES
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(Express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.get("/", function (req, res) {
  res.render("home.ejs");
});

app.get(
  "/campgrounds",
  catchAsync(async function (req, res, next) {
    const camps = await Campground.find({});
    res.render("./campgrounds/index.ejs", { camps });
  })
);

app.get("/campgrounds/new", function (req, res) {
  res.render("./campgrounds/new.ejs");
});

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async function (req, res, next) {
    const { campground } = req.body;

    if (!campground) throw new ServerError("Invalid form data", 400);
    const camp = new Campground(campground);
    await camp.save();
    console.log(camp);
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async function (req, res, next) {
    const id = req.params.id;
    const r = await Campground.findByIdAndDelete(id);
    console.log("Campground deleted:", r);
    res.redirect("/campgrounds");
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async function (req, res, next) {
    const id = req.params.id;
    const { campground } = req.body;
    console.log(campground);
    // await Campground.validate({ price: campground.price }, ["price"]);
    await Campground.findByIdAndUpdate(id, campground, { runValidators: true });

    res.redirect(`/campgrounds/${id}`);
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async function (req, res, next) {
    const id = req.params.id;
    const camp = await Campground.findById(id);
    console.log("Editing:", camp);
    res.render("./campgrounds/edit.ejs", { camp });
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async function (req, res, next) {
    const id = req.params.id;
    const camp = await Campground.findById(id).populate("reviews");
    res.render("./campgrounds/show.ejs", { camp });
  })
);

app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchAsync(async function (req, res, next) {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await Promise.all([camp.save(), review.save()]);
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async function (req, res, next) {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);
// app.all("*", function (req, res, next) {
//   next(new ServerError("Page Not Found", 404));
// });

app.use(function (err, req, res, next) {
  console.log("Error handler:", err.name);
  console.log(err);
  const { message = "Something went wrong", statusCode = 500 } = err;
  res.status(statusCode);
  res.render("./partials/error.ejs", { err });
});

app.listen(3000, function () {
  console.log("Listening http://localhost:3000/");
});

function validateCampground(req, res, next) {
  // Joi validation star
  const { error } = campgroundSchema.validate(req.body);
  console.log(error);
  if (error) {
    const msj = error.details.map((err) => err.message).join(", ");
    throw new ServerError(msj, 400);
  }
  // Joi end validation
  next();
}

function validateReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msj = error.details.map((err) => err.message).join(", ");
    throw new ServerError(msj, 400);
  }
  next();
}
