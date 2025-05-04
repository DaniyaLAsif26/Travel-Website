const Listing = require("../models/listing")

//index route
module.exports.indexListing = async (req, res, next) => {
    let allListings = await Listing.find().populate("reviews");

    allListings = allListings.map((listing) => {
        const reviews = listing.reviews;
        const total = reviews.length;
        const avg = total > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
            : null;

        return {
            ...listing.toObject(),
            avgRating: avg,
            totalReviews: total
        };
    });

    res.render("listings/index.ejs", { allListings });
};

//create route
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path
    let filename = req.file.filename

    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    newListing.image = { url, filename }
    await newListing.save()
    req.flash("success", "Successfully created a new listing")
    res.redirect(`/listings/${newListing._id}`)
}

//show route
// module.exports.showListing = async (req, res, next) => {
//     let { id } = req.params
//     const listing = await Listing.findById(id)
//         .populate({
//             path: "reviews",
//             populate: {
//                 path:
//                     "author"
//             },
//         })
//         .populate("owner")
//     if (!listing) {
//         req.flash("error", "Cannot find listing")
//         res.redirect("/listings")
//     }

//     const dates = listing.reviews.map(review => {
//         return review.createdAt.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     });

//     listing = listing.map((listing) => {
//         const reviews = listing.reviews;
//         const total = reviews.length;
//         const avg = total > 0
//             ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
//             : null;

//         return {
//             ...listing.toObject(),
//             avgRating: avg,
//             totalReviews: total
//         };
//     });

//     res.render("listings/show.ejs", { listing, dates })
// }

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Cannot find listing");
        return res.redirect("/listings");
    }

    // Format review creation dates
    const dates = listing.reviews.map(review => {
        return review.createdAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    });

    // Calculate total reviews and average rating
    const total = listing.reviews.length;
    const avg = total > 0
        ? (listing.reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
        : null;

    // Convert to plain object and add computed fields
    const listingWithRatings = {
        ...listing.toObject(),
        avgRating: avg,
        totalReviews: total
    };

    res.render("listings/show.ejs", { listing: listingWithRatings, dates });
};


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

//serach route
module.exports.searchListing = async (req, res) => {
    const searchTerm = req.query.q || "";
    const terms = searchTerm.trim().split(/\s*,?\s+/); // Split by comma or space

    const regexConditions = terms.map(term => ({
        $or: [
            { title: { $regex: term, $options: "i" } },
            { location: { $regex: term, $options: "i" } },
            { country: { $regex: term, $options: "i" } }
        ]
    }));

    const foundListings = await Listing.find({ $and: regexConditions }).populate("reviews");

    const allListings = foundListings.map(listing => {
        const total = listing.reviews.length;
        const avg = total > 0
            ? (listing.reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
            : null;

        return {
            ...listing.toObject(),
            avgRating: avg,
            totalReviews: total
        };
    });

    res.render("listings/search.ejs", { allListings,  searchTerm});
};