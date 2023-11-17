const express = require("express")
const router = express.Router()
const serviceController = require("../controllers/serviceController")

router.get("/serviceschedule/:id", serviceController.postSchedule)

module.exports = router