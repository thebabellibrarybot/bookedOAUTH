function BookingFormInfo(database) {

    this.database = database

    const CONST = require("../utils/constants")
    const jwtUtil = require("../utils/jwt")
    const { uploadToS3 } = require("../utils/secretAWS")
    const AWS = require('aws-sdk');


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
            console.log(message)
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

    this.putBookingFormInfoById = async(request, response) => {
        try {
            console.log('starting putBookingFormInfoById')
            const oldBookingFormInfo = await this.database.getBookingByUserID(request.body.adminId)
            const id = request.body.id 
            const adminId = request.body.adminId
            if (oldBookingFormInfo) {
                console.log(oldBookingFormInfo, "oldBookingFormInfo from putBookingFormInfoById")
                const newBookingFormInfo = {
                    tattooInfo: {
                        customOptions: request.body.tattooInfo.customOptions?request.body.tattooInfo.customOptions:oldBookingFormInfo.tattooInfo.customOptions,
                        flashImages: request.body.tattooInfo.flashImages?request.body.tattooInfo.flashImages:oldBookingFormInfo.tattooInfo.flashImages,
                        hourlyPrice: request.body.tattooInfo.hourlyPrice?request.body.tattooInfo.hourlyPrice:oldBookingFormInfo.tattooInfo.hourlyPrice,
                        availableColors: request.body.tattooInfo.availableColors?request.body.tattooInfo.availableColors:oldBookingFormInfo.tattooInfo.availableColors,
                        small: request.body.tattooInfo.small?request.body.tattooInfo.small:oldBookingFormInfo.tattooInfo.small,
                        medium: request.body.tattooInfo.medium?request.body.tattooInfo.medium:oldBookingFormInfo.tattooInfo.medium,
                        large: request.body.tattooInfo.large?request.body.tattooInfo.large:oldBookingFormInfo.tattooInfo.large,
                        availableTimes: request.body.tattooInfo.availableTimes?request.body.tattooInfo.availableTimes:oldBookingFormInfo.tattooInfo.availableTimes,
                    },
                    adminInfo: {
                        displayName: request.body.adminInfo.displayName?request.body.adminInfo.displayName:oldBookingFormInfo.adminInfo.displayName,
                        bio: request.body.adminInfo.bio?request.body.adminInfo.bio:oldBookingFormInfo.adminInfo.bio,
                        profileImage: request.body.adminInfo.profileImage?request.body.adminInfo.profileImage:oldBookingFormInfo.adminInfo.profileImage, /// this shoudl just be a url post multermidlleware
                        backgroundImage: request.body.adminInfo.backgroundImage?request.body.adminInfo.backgroundImage:oldBookingFormInfo.adminInfo.backgroundImage,
                        location: request.body.adminInfo.location?request.body.adminInfo.location:oldBookingFormInfo.adminInfo.location,
                    },
                    themesInfo: {
                        themes: request.body.themesInfo.themes?request.body.themesInfo.themes:oldBookingFormInfo.themesInfo.themes,
                    },
                    calendarInfo: {
                        blockedWeekDates: request.body.calendarInfo.blockedWeekDates?request.body.calendarInfo.blockedWeekDates:oldBookingFormInfo.calendarInfo.blockedWeekDates,
                        availableTimes: request.body.calendarInfo.availableTimes?request.body.calendarInfo.availableTimes:oldBookingFormInfo.calendarInfo.availableTimes,
                        currentlyBooked: request.body.calendarInfo.currentlyBooked?request.body.calendarInfo.currentlyBooked:oldBookingFormInfo.calendarInfo.currentlyBooked,
                        blockTime: request.body.calendarInfo.blockTime?request.body.calendarInfo.blockTime:oldBookingFormInfo.calendarInfo.blockTime,
                        bookedMin: request.body.calendarInfo.bookedMin?request.body.calendarInfo.bookedMin:oldBookingFormInfo.calendarInfo.bookedMin,
                    }
                }
                console.log(newBookingFormInfo, "newBookingFormInfo from putBookingFormInfoById")
                console.log(id, "id from putBookingFormInfoById")
                const data = await this.database.putBookingFormInfoById(id, newBookingFormInfo)
                console.log(data, 'data from putBookingFormInfoById')
                if (data) {
                    response.json(data)
                } else {
                    response.status(CONST.httpStatus.NOT_FOUND).json({ error: "User not found" })
                }
            }
        else {
            console.log('starting postBookingFormInfoById')
            const defaultBookingFormInfo = {
                adminId: request.body.adminId,
                tattooInfo: request.body.tattooInfo,
                adminInfo: request.body.adminInfo,
                themesInfo: request.body.themesInfo,
                calendarInfo: request.body.calendarInfo,
            }
            const data = await this.database.postBookingByUserID(request.body.adminId, defaultBookingFormInfo)
            if (data) {
                response.json(data)
            } else {
                response.status(CONST.httpStatus.NOT_FOUND).json({ error: "User not found" })
            }
        }
        } catch (error) {
            console.log(error, "error in putBookingFormInfoById")
            const message = `Imposible to get user booking form: ${error}`
            console.log(message)
            response.status(CONST.httpStatus.INTERNAL_ERROR).json({ error: message })
        }
    }
    this.putBookingFormInfoImagesById = async(request, response) => {
        // i should add a clean up s3 function here to delete old images
        console.log('starting putBookingFormInfoImagesById')
        try {
            const id = request.params.id
            const type = request.params.type
            const data = await uploadToS3(request.files, type, id)
            if (data) {
                // now update the users db with this.putBookingFormInfoById(id, newBookingFormInfo)
                const updatePromises = data.map(async (image) => {
                    const updateObject = {
                        $set: {
                            [`adminInfo.${type}`]: image.key
                        }
                    };
                    console.log(updateObject, "updateObject from putBookingFormInfoImagesById")
                    // Note: Assuming that putBookingFormInfoById returns a promise
                    return await this.database.putBookingFormInfoById(id, updateObject);
                });
    
                // Wait for all updates to complete before sending the response
                await Promise.all(updatePromises);
                console.log(data, "data from putBookingFormInfoImagesById")
                response.json(data)
            } else {
                console.log(data, "data from putBookingFormInfoImagesById")
                response.status(CONST.httpStatus.NOT_FOUND).json({ error: "User not found" })
            }
        } catch (error) {
            console.log(error, "error in putBookingFormInfoImagesById")
            const message = `Imposible to get user booking form: ${error}`
            console.log(message)
            response.status(CONST.httpStatus.INTERNAL_ERROR).json({ error: message })
        }
    }
    this.getS3Image = async(request, response) => {
        console.log('starting getS3Image')
        try {
            const id = request.params.id
            const type = request.params.type
            const file = request.params.file
            const key = `${id}/${type}/${file}`
            const s3 = new AWS.S3(
                {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    region: 'us-east-1'
                }
            );

            // Set the parameters for the pre-signed URL
            const params = {
            Bucket: 'bookedthebookingapp',
            Key: key,
            Expires: 6000, // The URL will expire in 60 seconds (adjust as needed)
            };

            // Generate the pre-signed URL
            const url = s3.getSignedUrl('getObject', params);
            response.json(url)

        } catch (error) {
            console.log(error, "error in getS3Image")
            const message = `Imposible to get user booking form: ${error}`
            console.log(message)
            response.status(CONST.httpStatus.INTERNAL_ERROR).json({ error: message })
        }
    }
}


const e = require("express")
const database = require("../services/database")
const bookingFormInfoController = new BookingFormInfo(database)

module.exports = bookingFormInfoController