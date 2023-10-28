const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const middlewares = require("../middlewares")

//#region Basic user login and register

router.post("/login", authController.login)
router.post("/register", authController.register)

//#region OAuth 2.0

const passport = require("passport")

const envValidator = require("../config/config")
const isGoogleCondigured = envValidator.isGoogleOAuth2ServiceConfigured()

router.get("/login/google/status", (request, response) => {
    let body = {
        serviceName: "Google OAuth 2.0",
        isActive: isGoogleCondigured !== undefined
    }
    console.log(body, 'body from auth via login/google/status')
    response.json(body)
})

// Google
if (isGoogleCondigured) {
    const googleProvider = require("../services/auth/oauth2Google")
    passport.use(googleProvider)
    router.get("/login/google", passport.authenticate("google", { scope: ["profile", "email"] }))
    console.log('fired oauth/google/callback')
    router.get("/oauth/google/callback",
        passport.authenticate("google"),
        authController.oauthGoogleLogin
    )
}

if (isGoogleCondigured) {
    passport.serializeUser(function(user, done) {
        done(null, user)
    })
    passport.deserializeUser(function(user, done) {
        done(null, user)
    })
    console.log('fired oauth/user')
    router.get("/oauth/user", middlewares.isUserAuthenticated, authController.getUserSession)
}

//#endregion

module.exports = router