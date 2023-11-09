import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import Radio from "../buttons/radioButtons"
import { useState } from "react"

const MyCalendar = ({bookingFormInfo}) => {

    const today = new Date()
    const [date, setDate] = useState(today)
    console.log(bookingFormInfo.calendarInfo, 'bookingFormInfo.calendarInfo from MyCalendar')
    const blockedWeekDates = bookingFormInfo.calendarInfo.blockedWeekDates
    const [viewTimes, setViewTimes] = useState(false)
    const [bookedTimes, setBookedTimes] = useState(null)
    const currentlyBooked = bookingFormInfo.calendarInfo.currentlyBooked

    function isDateDisabled(date) {

        if (date < today) {
            return true
        }

        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase()
        if (blockedWeekDates.includes(dayOfWeek)) {
            return true
        }

        return false
    }

    const handleDateChange = (date) => {
        const curDate = String(date).split('T')[0]
        setViewTimes(true)
        let availableTimes = []
        
        currentlyBooked.forEach((item) => {
            if (item.date === curDate) {
                availableTimes.push(item.time)
            }
        })

        setBookedTimes(availableTimes)
        console.log(availableTimes, 'availableTimes from handleDateChange', curDate, 'curDate from handleDateChange', currentlyBooked, 'currentlyBooked from handleDateChange')
    }

    return (
        <div className="form-line form-header" styles = {{width: '100%', margin: '0'}}>
            <Calendar
                onChange={handleDateChange}
                value={date}
                tileDisabled={({ date }) => isDateDisabled(date)}
            />

            <br></br>

            {viewTimes ? <Radio arr = {bookingFormInfo.tattooInfo.availableTimes} booked = {bookedTimes} header = 'Select a time:'/> : 'hidden times'}
        </div>
    )
}
export default MyCalendar