// REQUIREMENTS
const Express = require("express");
const campgroundsRouter = require("./routes/campgrounds");
const reviewsRouter = require("./routes/reviews");
const userRouter = require("./routes/user.js");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const favicon = require("serve-favicon");
const flashMiddleware = require("./utilities/flashMiddleware.js");

const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user.js");

// DB dependencies
const mongoose = require("mongoose");

// middleware utilities
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const ServerError = require("./utilities/ServerError.js");
const { expression } = require("joi");

// DATABASES
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

// EXPRESS SETS AND MIDDLEWARES
const app = new Express();

app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(Express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(Express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.png")));
app.use(session({ secret: "mySecret" }));

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const sessionConfig = {
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 604800000, // 7 days = 1000 * 60 * 60 * 24 * 7
    maxAge: 604800000,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(flashMiddleware);
// ROUTES
app.get("/", function (req, res) {
  res.render("home.ejs");
});

app.use("/", userRouter);

app.use("/campgrounds", campgroundsRouter);

app.use("/campgrounds", reviewsRouter);

// ERROR HANDLING
app.all("*", function (req, res, next) {
  console.log("Request error: ", req.path);
  next(new ServerError("Page Not Found", 404));
});

app.use(function (err, req, res, next) {
  console.log("Error handler:", err.name);
  console.log(err);
  const { message = "Something went wrong", statusCode = 500 } = err;
  res.status(statusCode);
  res.render("./partials/error.ejs", { err });
});

// APP LISTENER
app.listen(3000, function () {
  console.log("Listening http://localhost:3000/");
});
