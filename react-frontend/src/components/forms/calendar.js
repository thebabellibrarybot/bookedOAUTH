import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import Radio from "../buttons/radioButtons"
import { useState, useEffect } from "react"

const MyCalendar = ({bookingFormInfo}) => {

    const today = new Date()
    const [date, setDate] = useState(today)
    const blockedWeekDates = bookingFormInfo.calendarInfo.blockedWeekDates
    const [viewTimes, setViewTimes] = useState(false)
    const [bookedTimes, setBookedTimes] = useState(null)
    const [availableTimes, setAvailableTimes] = useState(null)
    const currentlyBooked = bookingFormInfo.calendarInfo.currentlyBooked
    const [userTimeZone, setUserTimeZone] = useState('')
    const timeRules = {
        blockTime: bookingFormInfo.calendarInfo.blockTime,
        availableTimes: bookingFormInfo.calendarInfo.availableTimes,
    }

    useEffect(() => {
        // Get the user's time zone
        const getTimeZone = () => {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
            setUserTimeZone(timeZone)
        }

        getTimeZone()
    }, [])

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

    function calculateAvailableTimeSlots(startTime, endTime, blockedTime) {
        const convertTo24Hour = (time) => {
            if (time.includes('am')) {
                const hour = Number(time.split(':')[0].replace(/(am|pm)/i, ''))
                const minute = Number(time.split(':')[1].replace(/(am|pm)/i, ''))
                return `${hour}:${minute}`
            } else if (time.includes('pm')) {
                const hour = Number(time.split(':')[0].replace(/(am|pm)/i, ''))
                const minute = Number(time.split(':')[1].replace(/(am|pm)/i, ''))
                return `${hour + 12}:${minute}`
            }
        }

        // Convert to 24-hour format
        const start24Hour = convertTo24Hour(startTime)
        const end24Hour = convertTo24Hour(endTime)

        const initialHour = Number(start24Hour.split(':')[0])
        const initialMinute = Number(start24Hour.split(':')[1])
        const finalHour = Number(end24Hour.split(':')[0])
        const finalMinute = Number(end24Hour.split(':')[1])

        let currentTime = initialHour * 60 + initialMinute
        const intervalInMinutes = Number(blockedTime.split(' ')[0])
        const endTimeInMinutes = finalHour * 60 + finalMinute

        let availableTimes = []
        
        while (currentTime <= endTimeInMinutes) {

            let hour = Math.floor(currentTime / 60)
            if (hour > 12) {
                hour -= 12
            }
            const minute = currentTime % 60
            if (minute === 0) {
                hour += ':00'
            } else {
                hour += `:${minute}`
            }
            availableTimes.push(hour)
            currentTime += intervalInMinutes
        }
        return availableTimes
    }

    function isTimeBlocked(availableTimes, bookedMin) {
        // find currently booked
        // adjust timebar with this info for this day
        // return available times
    }

    const handleDateChange = (date) => {
        const curDate = String(date).split('T')[0]
        let availableTimes = []
        
        currentlyBooked.forEach((item) => {
            if (item.date === curDate) {
                availableTimes.push(item.time)
            }
        })
        const startTime = timeRules.availableTimes.split('-')[0].trim(' ')
        const endTime = timeRules.availableTimes.split('-')[1].trim(' ')
        const available = calculateAvailableTimeSlots(startTime, endTime, timeRules.blockTime)
        setAvailableTimes(available)
        setDate(date)
        setViewTimes(true)
    }

    return (
        <div className="form-line form-header" styles = {{width: '100%', margin: '0'}}>
            <h2>set time from calendar</h2>
            <p>date: {date ? `${date}` : 'no date set yet'}</p>
            <p>selected time:</p>
            <p>timeZone: {userTimeZone ? `${userTimeZone}` : 'no time zone set yet'}</p>
            <Calendar
                onChange={handleDateChange}
                value={date}
                tileDisabled={({ date }) => isDateDisabled(date)}
            />

            <br></br>

            {viewTimes ? <Radio arr = {availableTimes} header = 'Select a time:'/> : 'hidden times' }

        </div>
    )
}
export default MyCalendar