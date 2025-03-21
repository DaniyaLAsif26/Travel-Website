const express = require("express")
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js")
const expressError = require("../utils/expressError.js")

const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const { reviewSchema } = require("../utils/schema.js")

// review schema validation middleware
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        throw new expressError(400, error)
    } else {
        next()
    }
}


// Review Route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success", "Review added successfully")
    res.redirect(`/listings/${listing._id}`)

}))

// delete review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Review Deleted")
    res.redirect(`/listings/${id}`)
}))

module.exports = router;