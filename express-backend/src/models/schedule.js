const { Schema, model, ObjectId } = require("mongoose")
const logger = require("../services/log")
const bcrypt = require("bcrypt")

const ScheduleSchema = new Schema({
    adminId: { type: String, required: true, unique: true },
    tattooInfo: { type: Object, required: true },
    adminInfo: { type: Object, required: true },
    themesInfo: { type: Object, required: true },
    calendarInfo: { type: Object, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: {type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    message: { type: String, required: true },
    image: { type: Array, required: true },
    size: { type: String, required: true },
    waiver: { type: Boolean, required: true },
    updated: {
        type: Date,
        default: Date.now 
    },
    created: {
        type: Date,
        default: Date.now
    }
})

ScheduleSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})


ScheduleSchema.pre("save", async function(next) {
    if (this.password) {
        const salt = await bcrypt.genSalt()
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

ScheduleSchema.post("save", function(doc, next) {
    let savedUser = doc
    logger.info(`User with email [${savedUser.email}] succesfully created`)
    next()
})

ScheduleSchema.pre("findOneAndUpdate", function(next) {
    this.options.runValidators = true
    next()
})

const ScheduleModel = model("scheduleinfo", ScheduleSchema)

module.exports = ScheduleModel