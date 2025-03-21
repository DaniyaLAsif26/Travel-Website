const express = require("express")
const app = express()

// const Listing = require("./models/listing.js")
// const Review = require("./models/review.js")
// const wrapAsync = require("./utils/wrapAsync.js")
// const { listingSchema, reviewSchema } = require("./utils/schema.js")
// const expressError = require("./utils/expressError.js")

const path = require("path")

const flash = require("connect-flash")
app.use(flash())

const session = require("express-session")

const sessionOptions = {
    secret: "abc123",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
}

app.use(session(sessionOptions))

const methodOverride = require("method-override")
app.use(methodOverride("_method"))


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "/public")));
app.use('/assets', express.static('assets'));

app.use(express.json());

// mongoDB
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

//port 8080
app.listen(8080, () => {
    console.log("server listening on 8080")
})

//index route
app.get("/", (req, res) => {
    res.send("Home page")
})

//flash middleware
app.use((req,res,next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})  

// Listing Route
const listings = require("./routes/listing.js")
app.use("/listings", listings)

// review routes
const reviews = require("./routes/review.js")
app.use("/listings/:id/reviews", reviews)



app.all("*", (req, res, next) => {
    next(new expressError(404, 'Page not found!!'))
})

//Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!!!" } = err
    res.status(statusCode).render("listings/error.ejs", { message })
})