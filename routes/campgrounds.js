const express = require("express");
const router = express.Router({ mergeParams: true });

// helpers
const catchAsync = require("../utilities/catchAsync.js");
const { validateCampground } = require("../utilities/validators.js");
const isAuthenticated = require("../utilities/isAuthenticated.js");
const { isAuthorCampground } = require("../utilities/isAuthor.js");
const { parser } = require("../utilities/cloudinary.js");

const campCtrl = require("../controllers/campgroundsCtrl.js");

router
  .route("/")
  .get(catchAsync(campCtrl.index))
  .post(isAuthenticated, validateCampground, parser.array("image"), catchAsync(campCtrl.postNewCamp));
// .post(parser.single("image"), function (req, res) {
//   console.log(req.body, req.file.path);
// });

router.get("/new", isAuthenticated, campCtrl.getNewForm);

router
  .route("/:id")
  .get(catchAsync(campCtrl.getOneCamp))
  .delete(isAuthenticated, isAuthorCampground, catchAsync(campCtrl.deleteOneCamp))
  .put(isAuthenticated, isAuthorCampground, parser.array("image"), validateCampground, catchAsync(campCtrl.putEditOne));

router.get("/:id/edit", isAuthenticated, isAuthorCampground, catchAsync(campCtrl.getEditForm));

module.exports = router;
