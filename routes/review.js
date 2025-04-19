const express = require("express")
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js")

// Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

// delete review
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router;