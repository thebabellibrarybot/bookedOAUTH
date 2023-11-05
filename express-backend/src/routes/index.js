const express = require("express")
const router = express.Router()

const authApi = require("./auth")
const usersApi = require("./users")
const bookingFormInfoApi = require("./bookingFormInfo")
const scheduleApi = require("./schedule")
//const calendarApi = require("./calendar")
//const schedulerApi = require("./scheduler")

router.use(authApi)
router.use(usersApi)
router.use(bookingFormInfoApi)
router.use(scheduleApi)
//router.use(calendarApi)
//router.use(schedulerApi)

module.exports = router
