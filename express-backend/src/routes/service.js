const express = require("express")
const router = express.Router()
const serviceController = require("../controllers/serviceController")

router.post("/schedule/:id", serviceController.postSchedule)

module.exports = router