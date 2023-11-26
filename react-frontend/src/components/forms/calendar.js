import Calendar from "react-calendar"
import { useState, useEffect } from "react"
import { calculateAvailableTimeSlots, filterArrayByWeekday, filterCurretnlyBookedByDate } from "../../services/time"
import { RotaryList } from "../forms"

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
    // add a handler that will show the number of bookings on each day

    return (
        <div className="cal-form-line">
            <h3 style = {{textAlign: 'left'}}>Schedule your booking</h3>
            <Calendar
                onChange={handleDateChange}
                value={date}
                tileDisabled={({ date }) => filterArrayByWeekday(date, bookingFormInfo.calendarInfo.blockedWeekDates)}
            />

            <br></br>

            {viewTimes ? 
                <>
                    <h3 style = {{textAlign: 'left'}}>Available times</h3>
                    <RotaryList options={availableTimes} callbackFunction={callBackFunction}/>     
                </>
                : null }
        </div>
    )
}
export default MyCalendar