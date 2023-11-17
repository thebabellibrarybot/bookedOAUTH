function BookingFormInfo(database) {

    this.database = database

    const CONST = require("../utils/constants")
    const jwtUtil = require("../utils/jwt")

    this.getBookingByUserID = async(request, response) => {
        const id = request.params.id

        try {
            const token = await this.database.getUserById(id)
            console.log(token, "token from getBookingByUserID")
            if (!token) {
                const message = "UserBookingForm not found"
                this.logger.info(`Bookingform not found for [${id}, ${token}]. ${message}`)
                return response.status(CONST.httpStatus.NOT_FOUND).json({ error: message })
            } else {
                this.database.getBookingByUserID(id)
                    .then(user => {
                        const tokenObject = jwtUtil.generateJWT(token)
                        response.cookie("adminSched", tokenObject, { httpOnly: true, maxAge: CONST.maxAgeCookieExpired })
                        response.json(user)
                    })
                    .catch(err => {
                        response.status(CONST.httpStatus.NOT_FOUND).json({ error: err })
                    })
            }
        } catch(error) {
            const message = `Imposible to get user booking form: ${error}`
            this.logger.error(message)
            response.status(CONST.httpStatus.INTERNAL_ERROR).json({ error: message })
        }
    }

    this.postBookingByUserID = async(request, response) => {

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

    this.putBookingByUserId = async(request, response) => {

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