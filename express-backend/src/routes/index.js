const express = require("express")
const router = express.Router()

const authApi = require("./auth")
const usersApi = require("./users")
const bookingFormInfoApi = require("./bookingFormInfo")
//const calendarApi = require("./calendar")
//const schedulerApi = require("./scheduler")

router.use(authApi)
router.use(usersApi)
router.use(bookingFormInfoApi)
//router.use(calendarApi)
//router.use(schedulerApi)

module.exports = router
