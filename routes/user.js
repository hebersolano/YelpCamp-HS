const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utilities/catchAsync.js");
const passport = require("passport");
const catchReturnUrl = require("../utilities/catchReturnUrl.js");

const usersCtrl = require("../controllers/usersCtrl.js");

router
  .route("/register")
  .get(usersCtrl.getRegisterForm)
  .post(catchAsync(usersCtrl.postNewUser));

router
  .route("/login")
  .get(usersCtrl.getLoginForm)
  .post(
    catchReturnUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    usersCtrl.loginUser
  );

router.get("/logout", usersCtrl.logoutUser);

module.exports = router;
