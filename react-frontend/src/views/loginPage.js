import React, { useState, useEffect } from 'react'

import { CONST } from "config"
import { authController, serviceController } from "services/http"
import { CredentialsLoginForm } from "components/forms"
import { GoogleOAuth2Button, LinkButton } from 'components/buttons'
import { useNavigate } from 'react-router-dom'

function Separator () {
    return (
        <div className='or-container my-4'>
            <p className='or-divider'>
                or
            </p>
        </div>
    )
}

function LoginPage({handleLogin}) {

    let navigate = useNavigate()

    const [isGoogleAvailable, setIsGoogleAvailable] = useState(false)

    useEffect(() => {
        let isUserAuthenticated = localStorage.getItem("sid")
        if (isUserAuthenticated) {
            handleLogin()
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
        let { sid } = data

        if (!sid) {
            let error = "An error occurred during the login process"
            console.log(error)
            setMessageError(error)
            return
        }
        console.log("sid", sid, data, "onSuccessLogin")
        localStorage.setItem("sid", JSON.stringify(sid))
        handleLogin()
        navigate(-1)
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
        <section className='login-card'>

            <h2 className='mb-3'>Log in</h2>

            { isGoogleAvailable && <GoogleOAuth2Button onClick={startWithGoogle} /> }

            <br />

            <CredentialsLoginForm
                onSubmit={startWithEmail}
                messageError={messageError}
            />

            <LinkButton route={"/register"} previousText="Don´t have an account?" linkText="Sign up"/>
        </section>
    )
}

export default LoginPage