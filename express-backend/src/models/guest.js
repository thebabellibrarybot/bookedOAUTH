const { Schema, model, ObjectId } = require("mongoose")
const logger = require("../services/log")

const GuestKeySchema = new Schema({
    uuid: { type: String, required: true },
    secretKey: { type: String, required: true },
    refreshToken: { type: String, required: false },
    altKey: { type: String, required: false },
})

GuestKeySchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

GuestKeySchema.post("save", function(doc, next) {
    let savedGuestKey = doc
    logger.info(`GuestKey with email [${savedGuestKey.email}] succesfully created`)
    next()
})

GuestKeySchema.pre("findOneAndUpdate", function(next) {
    this.options.runValidators = true
    next()
})

const GuestKey = model("GuestKey", GuestKeySchema)

module.exports = GuestKey