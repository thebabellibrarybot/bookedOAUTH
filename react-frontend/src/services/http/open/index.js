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

const putBookingProfile = (body) => {
    if (!body) {
        console.log(body, "no body from putBookingProfile")
        throw "body cannot be null or undefined"
    }
    console.log(body, "body from putBookingProfile")
    let uri = CONST.uri.resources.BOOKINGPROFILE

    return axios.put(uri, body, {
        withCredentials: true,
    })
}

const putBookingProfileImages = (body, id, type) => {
    if (!body) {
        console.log(body, "no body from putBookingProfileImages")
        throw "body cannot be null or undefined"
    }
    console.log(body, "body from putBookingProfileImages", id)
    console.log(Object.fromEntries(body.entries()), "Object.fromEntries(body.entries())")
    let uri = CONST.uri.resources.BOOKINGPROFILEIMAGES + `/${id}` + `/${type}`

    return axios.put(uri, body, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

const getS3Image = (s3key) => {
    if (!s3key) {
        console.log(s3key, "no s3key from getS3Image")
        throw "s3key cannot be null or undefined"
    }
    console.log(s3key, "s3key from getS3Image")
    let uri = CONST.uri.resources.GETS3IMAGE + `/${s3key}`

    return axios.get(uri, {
        withCredentials: true,
    })
}



export {
    getUserBookingInfoByID,
    postSchedule,
    sendBookingEmail,
    putBookingProfile,
    putBookingProfileImages,
    getS3Image
}