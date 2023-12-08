import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { openController } from "../services/http"
import { LogoutButton } from 'components/buttons'
import { useNavigate } from 'react-router-dom'

const AcceptEvent = ({handleLogout}) => {

    console.log("AcceptEvent.js")

    const bookingId = useParams().id
    const eventId = useParams().eventid
    const navigate = useNavigate()

    const [state, setState] = useState({
        booking: null,
        event: null,
    })
    const [isLoaded, setIsLoaded] = useState(false)

    // useEffect Hook to get the booking data and event data from the param
    useEffect(() => {
        const fetchData = async () => {
            const booking = await openController.getUserBookingInfoByID(bookingId)
            const event = await openController.getEventById(eventId)
            setState({
                booking: booking.data,
                event: event.data,
            })
            setIsLoaded(true)
        }
        fetchData()
    }, [])

    const logout = () => {
        handleLogout()
        localStorage.removeItem("sid")
        navigate("/")
    }

    return (
        <div>
            <h1>Accept Event</h1>
            <LogoutButton handleLogout={logout} />
        </div>
    )
}
export default AcceptEvent