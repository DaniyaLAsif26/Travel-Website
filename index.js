const express = require("express")
const app = express()

const Listing = require("./models/listing.js")

const path = require("path")

const methodOverride = require("method-override")

const wrapAsync = require("./utils/wrapAsync.js")

const expressError = require("./utils/expressError.js")

app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(methodOverride("_method"))

app.use(express.static(path.join(__dirname, "/public")));

app.use('/assets', express.static('assets'));

app.use(express.json());

const { listingSchema } = require("./utils/schema.js")

const mongoose = require("mongoose")
const MONGO_URL = "mongodb://127.0.0.1:27017/musafir"
async function main() {
    await mongoose.connect(MONGO_URL)
}
main()
    .then(() => {
        console.log("connected to DB")
    })
    .catch(() => {
        console.log("error in connecting to DB")
    })


// schema validation middleware
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)
    if (error) {
        throw new expressError(400, error)
    } else {
        next()
    }
}
//index route
app.get("/", (req, res) => {
    res.send("Home page")
})

//home route
app.get("/listings", wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find()
    res.render("listings/index.ejs", { allListings })
}));

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

app.post("/listings",
    validateListing,
     wrapAsync(async (req, res, next) => {
    
    const newListing = new Listing(req.body.listing)
    await newListing.save()
    res.redirect(`/listings/${newListing._id}`)
}))

//show route
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
}))

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res, next) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
}))

app.put("/listings/:id",validateListing,
     wrapAsync(async (req, res, next) => {
    
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
}))

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))


app.listen(8080, () => {
    console.log("server listening on 8080")
})

app.all("*", (req, res, next) => {
    next(new expressError(404, 'Page not found!!'))
})

//Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!!!" } = err
    res.status(statusCode).render("listings/error.ejs", { message })
})