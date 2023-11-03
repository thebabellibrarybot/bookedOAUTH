function BookingFormInfo(database) {

    this.database = database

    const CONST = require("../utils/constants")

    this.getBookingByUserID = (request, response) => {
        const id = request.params.id
        
        this.database.getBookingByUserID(id)
            .then(user => {
                response.json(user)
            })
            .catch(err => {
                response.status(CONST.httpStatus.NOT_FOUND).json({ error: err })
            })
    }

    this.postBookingByUserID = (request, response) => {

        const id = request.params.id
        const booking = request.body

        this.database.getBookingByUserID(id)
            .then(user => {
                if (!user) {
                    const message = "UserBookingForm not found"
                    this.logger.info(`Bookingform not found for [${id}, ${user}]. ${message}`)
                    this.logger.info(`Bookingform created for user [${booking.adminInfo.displayName}]`)
                    this.database.postBookingByUserID(id, booking)
                } else {
                    const message = "UserBookingForm already exists"
                    this.logger.info(`Booking form found for [${id}, ${user}]. ${message}`)
                    this.logger.info(`Booking form updated for user [${booking.adminInfo.displayName}]`)
                    this.database.putBookingByUserID(id, booking)
                }
                }
            )
            .catch(err => {
                response.status(CONST.httpStatus.NOT_FOUND).json({ error: err })
            }
        )
    }
}


const database = require("../services/database")
const bookingFormInfoController = new BookingFormInfo(database)

module.exports = bookingFormInfoController