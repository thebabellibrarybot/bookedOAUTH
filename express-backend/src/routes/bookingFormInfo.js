const express = require("express")
const router = express.Router()
const bookingFormInfoController = require("../controllers/bookingFormInfoController")

router.get("/bookingforminfo/:id", bookingFormInfoController.getBookingByUserID)
//router.delete("/bookingforminfo/:id", userController.deleteUserById)
//router.post("/bookingforminfo/:id", userController.createBookingFormInfo)
//router.put("/bookingforminfo/:id", userController.updateBookingFormInfo)

module.exports = router