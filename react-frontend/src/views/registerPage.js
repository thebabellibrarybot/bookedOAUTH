import React from 'react'
import { RegisterForm } from 'components/forms'
import { LinkButton } from 'components/buttons'
import { authController, serviceController } from "services/http"
import { GoogleOAuth2Button } from 'components/buttons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CONST } from "config"
import { handleLogin } from "services/http/open"

function RegisterPage() {

    const registerUser = function (credentials) {
        return authController.registerUser(credentials)
    }
    let navigate = useNavigate()

    const [isGoogleAvailable, setIsGoogleAvailable] = useState(false)

    useEffect(() => {
        let isUserAuthenticated = localStorage.getItem("sid")
        if (isUserAuthenticated) {
            return navigate("/home")
        }
        
        serviceController.isOAuth2GoogleAvailable()
            .then(response => {
                let { serviceName, isActive }= response.data
                console.log(`${serviceName} status: ${isActive ? "Available" : "Not available"}`)
                setIsGoogleAvailable(isActive)
            })

    }, [])


    const [messageError, setMessageError] = useState("")

    const startWithGoogle = function (e) {
        e.preventDefault()
        console.log("startWithGoogle")
        authController.startWithOAuth2(CONST.uri.auth.GOOGLE_LOGIN)
            .then(onSuccessLogin)
            .catch(onFailLogin)
    }

    const startWithEmail = function (credentials) {
        return authController.startWithCredentials(credentials)
            .then(onSuccessLogin)
            .catch(onFailLogin)
    }

    const onSuccessLogin = function ({data}) {
        navigate("/home")
    }

    const onFailLogin = function (error) {
        if (typeof error !== "object" && !error.response?.data) {
            return
        }
        error = error.response.data.error
        console.log(error)
        setMessageError(error)
    }

    
    return (            
        <div className='login-card'>
            <h2 className='mb-3'>Create account</h2>

            <RegisterForm onSubmit={registerUser}/>

            { isGoogleAvailable && <GoogleOAuth2Button onClick={startWithGoogle} /> }
            <LinkButton route={"/login"} previousText="Already Have an account" linkText="Sign in"/>
        </div>
    )
}


export default RegisterPage