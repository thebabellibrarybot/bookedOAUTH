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

export {
    getUserBookingInfoByID
}