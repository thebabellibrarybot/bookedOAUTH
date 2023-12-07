import { useLocation, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Spinner } from "../views"
import { openController } from "../services/http"

const ConfirmedBooking = () => {

    const bookingId = useParams().id
    const eventId = useParams().eventid

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


    if (!isLoaded) {
        return (
            <div className="loading">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="confirmed-booking">
            <h1>Booking confirmed!</h1>
            <p>Thank you for booking with us.</p>
            <p>save your booking info</p>
            <p>check for the calendarevent</p>
            <p>send a deposit</p>
        </div>
    )
}
export default ConfirmedBooking