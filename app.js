if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const dbUrl = process.env.ATLAS_DB

const express = require("express")
const app = express()
const path = require("path")
app.use(express.json());

const expressError = require("./utils/expressError.js")

const flash = require("connect-flash")
app.use(flash())

const session = require("express-session")
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
    console.log("session store error", e)
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
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

const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "/public")));
app.use('/assets', express.static('assets'));

// <--------------------------------------------------------------------------->

// mongoDB
const mongoose = require("mongoose")
// const MONGO_URL = "mongodb://127.0.0.1:27017/musafir"
async function main() {
    await mongoose.connect(dbUrl)
}
main()
    .then(() => {
        console.log("connected to DB")
    })
    .catch(() => {
        console.log("error in connecting to DB")
    })

//flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})

//port 8080
app.listen(8080, () => {
    console.log("server listening on 8080")
})

//index route
app.get("/aboutus", (req, res) => {
    res.send("About us page")
})

// Listing Route
const listingsRouter = require("./routes/listing.js")
app.use("/listings", listingsRouter)
// review route
const reviewsRouter = require("./routes/review.js")
app.use("/listings/:id/reviews", reviewsRouter)
// User route
const userRouter = require("./routes/user.js")
app.use("/user", userRouter)


//Error handling middleware

app.all("*", (req, res, next) => {
    next(new expressError(404, 'Page not found!!'))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!!!" } = err
    res.status(statusCode).render("listings/error.ejs", { message })
})
