const { Schema, model, ObjectId } = require("mongoose")
const logger = require("../services/log")

const BookingFormInfoSchema = new Schema({
    adminId: { type: String, required: true },
    tattooInfo: { type: Object, required: true },
    adminInfo: { type: Object, required: true },
    themesInfo: { type: Object, required: true },
    calendarInfo: { type: Object, required: true },
    updated: {
        type: Date,
        default: Date.now 
    },
    created: {
        type: Date,
        default: Date.now
    }
})

BookingFormInfoSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

BookingFormInfoSchema.post("save", function(doc, next) {
    let savedUser = doc
    logger.info(`User with email [${savedUser.email}] succesfully created`)
    next()
})

BookingFormInfoSchema.pre("findOneAndUpdate", function(next) {
    this.options.runValidators = true
    next()
})

const BookingFormInfoModel = model("bookingFormInfo", BookingFormInfoSchema)

module.exports = BookingFormInfoModel