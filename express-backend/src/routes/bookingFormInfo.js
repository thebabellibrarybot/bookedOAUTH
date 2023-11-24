const express = require("express")
const router = express.Router()
const bookingFormInfoController = require("../controllers/bookingFormInfoController")
const multer = require('multer');


const storage = multer.memoryStorage(); // Use memory storage for simplicity, you can customize this based on your needs
const upload = multer({ storage: storage });

function errorHandler(err, req, res, next) {
    console.error(err, 'from err handler');
    res.status(400).json({ 'error': err.message });
  }

router.get("/bookingforminfo/:id", bookingFormInfoController.getBookingByUserID)
router.post("/bookingforminfo/:id", bookingFormInfoController.postBookingByUserID)
router.put("/admininfo", bookingFormInfoController.putBookingFormInfoById)
router.put("/admininfoimages/:id/:type", upload.array('file'), errorHandler, bookingFormInfoController.putBookingFormInfoImagesById)
router.get("/s3image/:id/:type/:file", bookingFormInfoController.getS3Image)

module.exports = router