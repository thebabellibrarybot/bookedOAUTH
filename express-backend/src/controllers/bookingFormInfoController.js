function BookingFormInfo(database) {

    this.database = database

    const CONST = require("../utils/constants")

    this.getBookingByUserID = (request, response) => {
        const id = request.params.id

        console.log('get user booking fired', id)
        
        this.database.getBookingByUserID(id)
            .then(user => {
                console.log(user, "user from getBookingByUserID")
                response.json(user)
            })
            .catch(err => {
                response.status(CONST.httpStatus.NOT_FOUND).json({ error: err })
            })

    }

  /*  this.deleteUserById = (request, response) => {
        const id = request.params.id
        this.database.deleteUserById(id)
            .then((deletedUser) => {
                let dto = userToDTO(deletedUser)
                response.json(dto)
            })
            .catch(err => {
                response.status(CONST.httpStatus.CONFLICT).json({ error: err })
            })
    } */

}


const database = require("../services/database")
const bookingFormInfoController = new BookingFormInfo(database)

module.exports = bookingFormInfoController






