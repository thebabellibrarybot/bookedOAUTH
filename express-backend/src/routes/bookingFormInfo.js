const express = require("express")
const router = express.Router()
const bookingFormInfoController = require("../controllers/bookingFormInfoController")

router.get("/bookingforminfo/:id", bookingFormInfoController.getBookingByUserID)
router.post("/bookingforminfo/:id", bookingFormInfoController.postBookingByUserID)

module.exports = router