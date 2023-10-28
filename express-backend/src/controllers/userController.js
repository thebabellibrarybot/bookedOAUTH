function UserController(database) {

    this.database = database

    const CONST = require("../utils/constants")

    this.getUserById = (request, response) => {
        const id = request.params.id
        const providerId = request.query?.providerId

        console.log('get user fired')
        
        this.database.getUserById(id)
            .then(user => {
                let dto = userToDTO(user, providerId)
                response.json(dto)
            })
            .catch(err => {
                response.status(CONST.httpStatus.NOT_FOUND).json({ error: err })
            })

    }

    this.deleteUserById = (request, response) => {
        const id = request.params.id
        this.database.deleteUserById(id)
            .then((deletedUser) => {
                let dto = userToDTO(deletedUser)
                response.json(dto)
            })
            .catch(err => {
                response.status(CONST.httpStatus.CONFLICT).json({ error: err })
            })
    }

    //#endregion
}


const database = require("../services/database")
const userController = new UserController(database)

module.exports = userController