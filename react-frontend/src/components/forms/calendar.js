import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import SetTimeButton from "../buttons/setTime"
import { useState, useEffect } from "react"
import { calculateAvailableTimeSlots, filterArrayByWeekday, filterCurretnlyBookedByDate } from "../../services/time"

const MyCalendar = ({bookingFormInfo, callBackTrigger}) => {

    const today = new Date()
    const [date, setDate] = useState(today)
    const [userTimeZone, setUserTimeZone] = useState('')
    const [viewTimes, setViewTimes] = useState(false)
    const timeRules = {
        blockTime: bookingFormInfo.calendarInfo.blockTime,
        availableTimes: bookingFormInfo.calendarInfo.availableTimes,
    }
    const availableTimes = calculateAvailableTimeSlots(
        timeRules.availableTimes.split('-')[0].trim(' '), 
        timeRules.availableTimes.split('-')[1].trim(' '), 
        timeRules.blockTime
    )
    const currentlyBooked = (filterCurretnlyBookedByDate(bookingFormInfo.calendarInfo.currentlyBooked, date, bookingFormInfo.calendarInfo.bookedMin, timeRules.blockTime)).flat()

    useEffect(() => {
        const getTimeZone = () => {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
            setUserTimeZone(timeZone)
        }
        getTimeZone()
    }, [])


    const callBackFunction = (childData) => {
        callBackTrigger({
            date: date,
            time: childData,
            timeZone: userTimeZone
        })
    }

    const handleDateChange = (date) => {
        setDate(date)
        setViewTimes(true)
    }

    return (
        <div className="cal-form-line">
            <h2>set time from calendar</h2>
            <p>date: {date ? `${date}` : 'no date set yet'}</p>
            <p>timeZone: {userTimeZone ? `${userTimeZone}` : 'no time zone set yet'}</p>
            <Calendar
                onChange={handleDateChange}
                value={date}
                tileDisabled={({ date }) => filterArrayByWeekday(date, bookingFormInfo.calendarInfo.blockedWeekDates)}
            />

            <br></br>

            {viewTimes ? <SetTimeButton availableTimes = {availableTimes} currentBookings = {currentlyBooked} header = 'Select a time:' callBackFunction={callBackFunction}/> : 'hidden times' }

        </div>
    )
}
export default MyCalendar