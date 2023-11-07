const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const catchAsync = require("../utilities/catchAsync.js");

router.get("/register", function (req, res) {
  res.render("./users/register.ejs");
});

router.post(
  "/register",
  catchAsync(async function (req, res) {
    try {
      const { username, email, password } = req.body;
      const user = new User({
        email,
        username,
      });
      const registeredUser = await User.register(user, password);

      req.flash("newUser", "Welcome to Yelp-Camp!");
      res.redirect("/campgrounds");
    } catch (error) {
      console.dir(error);
      req.flash("error", error.message);
      res.redirect("/register");
    }
  })
);
module.exports = router;
