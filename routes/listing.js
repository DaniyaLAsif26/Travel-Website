const express = require("express")
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js")
const expressError = require("../utils/expressError.js")

const Listing = require("../models/listing.js")
const { listingSchema } = require("../utils/schema.js")

//listing schema validation middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        throw new expressError(400, error)
    } else {
        next()
    }
}

//index route
router.get("/", wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find()
    res.render("listings/index.ejs", { allListings })
}));

//new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

//create route
router.post("/",
    validateListing,
    wrapAsync(async (req, res, next) => {

        const newListing = new Listing(req.body.listing)
        await newListing.save()
        req.flash("success", "Successfully created a new listing")
        res.redirect(`/listings/${newListing._id}`)
    }))

//show route
router.get("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate("reviews")
    if (!listing) {
        req.flash("error", "Cannot find listing")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
}))

//edit route
router.get("/:id/edit", wrapAsync(async (req, res, next) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Cannot find listing")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing })
}))

router.put("/:id", validateListing,
    wrapAsync(async (req, res, next) => {
        
        let { id } = req.params
        await Listing.findByIdAndUpdate(id, { ...req.body.listing })
        req.flash("success", "Successfully edited listing")
        res.redirect(`/listings/${id}`)
    }))

//delete route
router.delete("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success", "listing deleted successfully")
    res.redirect("/listings")
}))

module.exports = router;