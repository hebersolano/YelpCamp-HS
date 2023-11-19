const User = require("../models/user.js");

module.exports = {
  getLoginForm: function (req, res) {
    res.render("./users/login.ejs");
  },

  loginUser: function (req, res) {
    req.flash("newUser", `Welcome back ${req.user.username}`);
    console.log("redirect login:", res.locals.redirectTo);
    req.session.redirectTo = res.locals.redirectTo;
    console.log("res.locals.redirect:", res.locals.redirect);
    const redirectTo = res.locals.redirect || "/campgrounds";
    // const redirectTo = res.locals.redirectTo || "/campgrounds";
    // delete res.locals.redirectTo;
    res.redirect(redirectTo);
  },

  logoutUser: function (req, res, next) {
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
  },

  getRegisterForm: function (req, res) {
    res.render("./users/register.ejs");
  },

  postNewUser: async function (req, res, next) {
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
  },
};
