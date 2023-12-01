import { useLocation } from "react-router-dom"

const ConfirmedBooking = () => {

    const state = useLocation().state
    console.log(state, 'state from confirmed booking')

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