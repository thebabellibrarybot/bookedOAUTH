import axios from "axios"
import { CONST } from "config"


const getUserById = (id, providerId = null) => {
    if (!id) {
        console.log(id, "no id from getUserById")
        localStorage.removeItem("sid")
        throw "id cannot be null or undefined"
    }

    let uri = CONST.uri.resources.USERS + id

    if (providerId) {
        console.log(providerId, "providerId from getUserById")
        uri = `${uri}?providerId=${providerId}`
    }

    return axios.get(uri, { withCredentials: true })
}

export {
    getUserById
}