const express = require("express")
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js")

// const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js")

const { cloudinary, storage } = require("../cloudConfig.js")
const multer = require('multer')
const upload = multer({ storage })

//Routes
router
    .route("/")
    .get(wrapAsync(listingController.indexListing))//index route
    .post(isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)//create route
    )


//new route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs")

})

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) //show route
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateForm))//update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))//delete route

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm))


module.exports = router;