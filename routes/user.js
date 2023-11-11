const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const catchAsync = require("../utilities/catchAsync.js");
const passport = require("passport");
const isAuthenticated = require("../utilities/isAuthenticated.js");
const catchReturnUrl = require("../utilities/catchReturnUrl.js");

router.get("/register", function (req, res) {
  res.render("./users/register.ejs");
});

router.post(
  "/register",
  catchAsync(async function (req, res, next) {
    try {
      const { username, email, password } = req.body;

      const user = new User({
        email,
        username,
      });

      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("newUser", "Welcome to Yelp-Camp!");
        res.redirect("/campgrounds");
      });
    } catch (error) {
      console.dir(error);
      req.flash("error", error.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", function (req, res) {
  res.render("./users/login.ejs");
});

router.post(
  "/login",

  catchReturnUrl,

  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),

  function (req, res) {
    console.log("User login...", req.user);
    req.flash("newUser", `Welcome back ${req.user.username}`);
    const redirectTo = res.locals.redirectTo || "/campgrounds";
    delete res.locals.redirectTo;
    res.redirect(redirectTo);
  }
);

router.get("/logout", function (req, res, next) {
  req.logOut(function (error) {
    if (error) {
      req.flash("error", error.message);
      next(error);
      return;
    }
    res.locals.user = undefined;
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
