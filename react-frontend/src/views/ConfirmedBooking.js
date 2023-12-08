import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Spinner } from "../views"
import { openController } from "../services/http"
import { Receipt, ProfileUserInfo, PaymentLinks } from "components/forms"

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

    console.log(state, "state")


    if (!isLoaded) {
        return (
            <div className="loading">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="content">
            <h1>Booking confirmed!</h1>
            <p>Thank you for booking with us.</p>
            <div className="form-line">
                <h3>Artist</h3>
                <ProfileUserInfo bookingFormInfo = {state.booking}></ProfileUserInfo>
            </div>
            <div className="form-line">
                <h3>Event</h3>
                <Receipt eventInfo = {state.event} bookingFormInfo = {state.booking}></Receipt>
            </div>

            {state.booking.tattooInfo.paymentType ?
                <PaymentLinks state = {state}></PaymentLinks>
                :null}

        </div>
    )
}
export default ConfirmedBooking