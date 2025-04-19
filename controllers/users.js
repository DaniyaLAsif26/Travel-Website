const User = require("../models/user");

// login user
module.exports.signupUser = async (req, res) => {
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
        req.flash("error", "User already exists, Please Log in")
        res.redirect("/user/signup")
    }
}

module.exports.loginUser = async (req, res) => {
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
}

//logout user
module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash("success", "Logged out successfully!")
        res.redirect("/listings")
    });
}

// signup user Form
module.exports.signUpForm = async (req, res) => {
    res.render("users/signup.ejs")
}

// login user Form
module.exports.logInForm = async (req, res) => {
    res.render("users/login.ejs")
}