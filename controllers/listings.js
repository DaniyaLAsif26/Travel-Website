const Listing = require("../models/listing")

//index route
module.exports.indexListing = async (req, res, next) => {
    const allListings = await Listing.find()
    res.render("listings/index.ejs", { allListings })
}

//create route
module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    await newListing.save()
    req.flash("success", "Successfully created a new listing")
    res.redirect(`/listings/${newListing._id}`)
}

//show route
module.exports.showListing = async (req, res, next) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path:
                    "author"
            },
        })
        .populate("owner")
    if (!listing) {
        req.flash("error", "Cannot find listing")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
}

//edit route
module.exports.editForm = async (req, res, next) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Cannot find listing")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing })
}

//update route
module.exports.updateForm = async (req, res, next) => {

    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash("success", "Successfully edited listing")
    res.redirect(`/listings/${id}`)
}

//delete route
module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success", "listing deleted successfully")
    res.redirect("/listings")
}