function UserDatabaseMongoDB(dbConnectionString) {

    const logger = require("../log")
    const mongoose = require("mongoose")
    const connectionString = dbConnectionString
    const User = require("../../models/user")
    const BookingFormInfo = require("../../models/bookingFormInfo")
    const Schedule = require("../../models/schedule")

    this.connect = () => {

        mongoose.connection.on("error", function (err) {
            logger.error("Database connection error: " + err)
        })

        mongoose.connection.on("disconnected", function () {
            logger.info("Database disconnected")
        })

        process.on("SIGINT", function () {
            mongoose.connection.close(function () {
                logger.info("Database process terminated")
                process.exit(0)
            })
        })

        if (!connectionString) {
            throw new Error(`${connectionString} is not a valid connection string`)
        }

        return mongoose.connect(connectionString)
    }

    this.close = () => {
        return mongoose.connection.close()
    }

    this.createUser = (user) => {
        if (!user) {
            throw "user cannot be null or undefined"
        }
        const { fullname = "", email, password = "" } = user

        const newUser = new User({
            fullname: fullname,
            email: email,
            password: password,
        })

        return newUser.save()
            .then((savedUser) => {
                return savedUser?.toJSON()
            })
    }

    this.deleteUserById = (id) => {
        if (!id) {
            throw "id cannot be null or undefined"
        }

        return User.findByIdAndDelete(id)
            .then((deletedUser) => {
                if (!deletedUser) {
                    throw "User not found"
                }
                return deletedUser?.toJSON()
            })
    }

    this.getUserById = (id) => {
        if (!id) {
            throw "id cannot be null or undefined"
        }

        return User.findById(id)
            .then((user) => {
                return user?.toJSON()
            })
    }

    this.getUserByEmail = (email) => {
        return User.findOne({ email: email })
            .then((user) => {
                return user?.toJSON()
            })
    }

    this.getUserByProviderId = (providerUserId) => {
        if (!providerUserId) {
            throw "providerUserId cannot be null or undefined"
        }
        return User.findOne({ "providers.providerUserId": providerUserId })
            .then((user) => {
                return user?.toJSON(providerUserId)
            })
    }

    this.addProviderUser = async (user) => {
        if (!user) {
            throw "user cannot be null or undefined"
        }
        if (!user.userId) {
            throw "userId fields cannot be null or undefined"
        }
        if (!user.providerUserId) {
            throw "providerUserId fields cannot be null or undefined"
        }
        if (!user.providerName) {
            throw "providerName fields cannot be null or undefined"
        }
        if (!user.refreshToken) {
            throw "refreshToken fields cannot be null or undefined"
        }
        let { userId, providerUserId, providerName, loginName = "", picture = "", refreshToken } = user

        return User.findByIdAndUpdate(userId, {
            $push: {
                providers: {
                    providerUserId: providerUserId,
                    providerName: providerName,
                    loginName: loginName,
                    picture: picture,
                    refreshToken: refreshToken
                }
            }}, {
            new: true
        }
        ).then((savedUser) => {
            return savedUser?.toJSON()
        })
    }

    this.getUsers = () => {
        return User.find({})
            .then((users) => {
                return users
            })
    }

    // first attempt at integrating bookingforminfo into the database
    this.getBookingByUserID = (userId) => {
        if (!userId) {
            throw "userId cannot be null or undefined"
        }

        return BookingFormInfo.findOne({ adminId: userId })
            .then((booking) => {
                return booking?.toJSON()
            })
    }

    this.postBookingByUserID = (userId, booking) => {
        if (!userId) {
            throw "userId cannot be null or undefined"
        }
        return BookingFormInfo.create(booking)
            .then((booking) => {
                return booking?.toJSON()
            })
    }
    
    this.putBookingByUserID = (userId, booking) => {
        if (!userId) {
            throw "userId cannot be null or undefined"
        }

        return BookingFormInfo.findOneAndUpdate({ adminId: userId }, booking, { new: true })
            .then((booking) => {
                return booking?.toJSON()
            })
    }

    this.deleteBookingByUserID = (userId) => {
        if (!userId) {
            throw "userId cannot be null or undefined"
        }

        return BookingFormInfo.findOneAndDelete({ adminId: userId })
            .then((deletedBooking) => {
                if (!deletedBooking) {
                    throw "Booking not found"
                }
                return deletedBooking?.toJSON()
            })
    }

    // schedule database handling functions
    this.addBookingSchedById = (userId, booking) => {
        if (!userId) {
            throw "userId cannot be null or undefined"
        }
        if (!booking) {
            throw "booking cannot be null or undefined"
        }
        return Schedule.create(userId, {
            $push: {
                booking: booking
            }}, {
            new: true
        }
        ).then((savedBooking) => {
            return savedBooking?.toJSON()
        })
    }
}

module.exports = UserDatabaseMongoDB