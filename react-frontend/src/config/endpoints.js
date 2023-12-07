
import { env } from "./config"

export const uri = {
    auth: {
        GOOGLE_LOGIN: env.API_SERVER + "/login/google",
        GITHUB_LOGIN: env.API_SERVER + "/login/github",
        GET_USER_SESSION: env.API_SERVER + "/oauth/user",
        CREDENTIALS_LOGIN: env.API_SERVER + "/login",
        REGISTER: env.API_SERVER + "/register"
    },
    resources: {
        USERS: env.API_SERVER + "/users/",
        BOOKINGFORMINFO: env.API_SERVER + "/bookingforminfo",
        BOOKINGFORMIMAGES: env.API_SERVER + "/bookingformimages",
        SCHEDULE: env.API_SERVER + "/schedule/:id", 
        BOOKINGPROFILE: env.API_SERVER + "/admininfo",
        BOOKINGPROFILEIMAGES: env.API_SERVER + "/admininfoimages",
        BOOKINGFLASHIMAGES: env.API_SERVER + "/adminflashimages",
        GETS3IMAGE: env.API_SERVER + "/s3image",
        EVENT: env.API_SERVER + "/schedule",
    },
    services: {
        OAUTH2_GOOGLE_STATUS: env.API_SERVER + "/login/google/status",
        OAUTH2_GITHUB_STATUS: env.API_SERVER + "/login/github/status"
    }
}