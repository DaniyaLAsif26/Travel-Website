const express = require("express")
const router = express.Router();
const User = require("../models/user.js")
const passport = require("passport")
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectURL } = require("../middleware.js");

// signup user
router.get("/signup", wrapAsync(async (req, res) => {
    res.render("users/signup.ejs")
}))

router.post("/signup", wrapAsync(async (req, res) => {
    console.log(req.body)
    try {
        let { username, email, password, re_password } = req.body
        if (password === re_password) {
            const newUser = new User({ username, email })
            const registeredUser = await User.register(newUser, password)
            req.login(registeredUser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", "Welcome to Musafir " + username)
                res.redirect("/listings")
            })
        }
        else {
            req.flash("error", "Passwords do not match")
            res.redirect("/user/signup")
        }
    }
    catch (e) {
        console.log(e.message)
        req.flash("error", "User already exists")
        res.redirect("/user/signup")
    }
}))

// login user

router.get("/login", async (req, res) => {
    res.render("users/login.ejs")
})

router.post("/login", saveRedirectURL, passport.authenticate('local', {
    failureRedirect: '/user/login',
    failureFlash: true
}), wrapAsync(async (req, res) => {
    let { username } = req.body;
    req.flash("success", "Welcome back! " + username);

    // Default redirect is to listings page
    let redirectUrl = res.locals.redirectURL || "/listings";

    // Handle review form (POST) and delete (DELETE) redirect URLs
    if (redirectUrl.includes("/reviews")) {
        // Remove everything from "/reviews" onward
        const index = redirectUrl.indexOf("/reviews");
        redirectUrl = redirectUrl.slice(0, index);
    }

    res.redirect(redirectUrl);  // Redirect to the right page
}));

//logout user
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash("success", "Logged out successfully!")
        res.redirect("/listings")
    });
})

module.exports = router
