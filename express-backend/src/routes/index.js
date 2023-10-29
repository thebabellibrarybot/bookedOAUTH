const express = require("express")
const router = express.Router()

const authApi = require("./auth")
const usersApi = require("./users")
const bookingFormInfoApi = require("./bookingFormInfo")

router.use(authApi)
router.use(usersApi)
router.use(bookingFormInfoApi)

module.exports = router
