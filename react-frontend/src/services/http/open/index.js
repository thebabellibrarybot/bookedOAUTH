import axios from 'axios'
import { CONST } from 'config'

const getUserBookingInfoByID = (id) => {
    if (!id) {
        console.log(id, "no id from getUserBookingInfoByID")
        localStorage.removeItem("sid")
        throw "id cannot be null or undefined"
    }

    let uri = CONST.uri.resources.BOOKINGFORMINFO + `/${id}`

    return axios.get(uri, { withCredentials: true })
}

const postSchedule = (schedule) => {
    if (!schedule) {
        console.log(schedule, "no schedule from postSchedule")
        throw "schedule cannot be null or undefined"
    }

    let uri = CONST.uri.resources.SCHEDULE

    return axios.post(uri, schedule, { withCredentials: true })
}

const sendBookingEmail = (email) => {
    if (!email) {
        console.log(email, "no email from sendBookingEmail")
        throw "email cannot be null or undefined"
    }

    let uri = CONST.uri.resources.SENDBOOKINGEMAIL

    return axios.post(uri, email, { withCredentials: true })
}


export {
    getUserBookingInfoByID,
    postSchedule,
    sendBookingEmail,
}