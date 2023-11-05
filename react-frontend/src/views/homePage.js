import React, { useEffect, useState } from 'react'
import { LogoutButton, BasicButton } from 'components/buttons'
import { usersController, openController } from 'services/http'
import { useNavigate } from 'react-router-dom'
import { useBookingFormInfoContext } from 'provider/bookingFormInfo'

function Spinner() {
    return (
        <div className="d-flex flex-column align-items-center">
            <span className="spinner-border text-primary mb-3" role="status" aria-hidden="true"></span>
            Loading...
        </div>
    )
}

function UserInformation ({user}) {

    console.log(user, "user")

    return (
        <div className='d-flex align-items-center mb-5'>
            {
                user.picture &&
                <img src={user.picture} className="avatar shadow me-2"/>
            }
            <div className='d-flex flex-column'>
                <strong>{user.fullname || user.login}</strong>
                <small>{user.email}</small>
            </div>
        </div>
    )
}

function HomePage({handleLogout}) {

    const [ userInformation, setUserInformation ] = useState(null)
    const { bookingFormInfo, setBookingFormInfo } = useBookingFormInfoContext()

    let navigate = useNavigate()

    useEffect(() => {
        let sid = localStorage.getItem("sid")
        console.log(sid, "sid")
        sid = JSON.parse(sid)
        let { id, providerId } = sid

        console.log(id, providerId, "id, providerId")

        usersController.getUserById(id, providerId)
            .then(({data}) => {
                console.log(data, "data from getUserById")
                if (!data || data === "") {
                    console.log("No user found", data, "logging out")
                }
                console.log(data)
                setUserInformation(data)
            })
            .catch(error => {
                console.error(error)
                logout()
            })

        openController.getUserBookingInfoByID(id)
            .then(({data}) => {
                console.log(data, "data from getUserBookingInfoByID")
                if (!data || data === "") {
                    console.log("No booking form found", data, "logging out")
                }
                console.log(data)
                setBookingFormInfo(data)
            })
            .catch(error => {
                console.error(error)
            })
    }, [])

    const logout = () => {
        handleLogout()
        console.log("logout")
        localStorage.removeItem("sid")
        navigate("/")
    }

    const fire = () => {

        openController.postSchedule("schedule")

    }


    if (!userInformation) {
        return <Spinner />
    }

    return (
        <div className='App-body'>
            <h1 className='mb-5'>Welcome!</h1>

            <UserInformation user={userInformation} />

            <BasicButton text = {"fire postBooking"} onClick={fire}/>

            {bookingFormInfo ? <BasicButton text={"Edit a Current Booking Form"} onClick={() => navigate("/editbookingform")}/> : <BasicButton text={"Create a Booking Form"} onClick={() => navigate("/editbookingform")}/>}

            <BasicButton text={"View Calendar"} onClick={() => navigate("/mycalendar")}/>

            <LogoutButton textContent={"Logout"} onClick={logout}/>
        </div>
    )
} 


export default HomePage