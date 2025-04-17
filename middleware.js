const Listing = require("./models/listing")
const Review = require("./models/review")
const expressError = require("./utils/expressError")
const { reviewSchema, listingSchema } = require("./utils/schema.js")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl
        req.flash("error", "You must be logged in first")
        return res.redirect("/user/login")
    }
    next()
}

module.exports.saveRedirectURL = (req, res, next) => {
    if (req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Permission denied")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params
    let review = await Review.findById(reviewId)
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Permission denied")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

//listing schema validation middleware
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        throw new expressError(400, error)
    } else {
        next()
    }
}

// review schema validation middleware
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        throw new expressError(400, error)
    } else {
        next()
    }
}