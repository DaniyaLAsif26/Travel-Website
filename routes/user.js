const express = require("express")
const router = express.Router();
const User = require("../models/user.js")
const passport = require("passport")
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectURL } = require("../middleware.js");

const UserController = require("../controllers/users.js")

//SignUp Routes
router
    .route("/signup")
    .get(wrapAsync(UserController.signUpForm))// signup user Form
    .post(wrapAsync(UserController.signupUser))// signup user

//LogIn Routes
router
    .route("/login")
    .get(UserController.logInForm)// login user Form
    .post(saveRedirectURL, passport.authenticate('local', {
        failureRedirect: '/user/login',
        failureFlash: true
    }), wrapAsync(UserController.loginUser))// login user

//logout user
router.get("/logout", UserController.logoutUser)

module.exports = router
