const convertTo24Hour = (time) => {
    if (time.toLowerCase().includes('am')) {
        const hour = Number(time.split(':')[0].replace(/(am|pm)/i, ''))
        const minute = Number(time.split(':')[1].replace(/(am|pm)/i, ''))
        return `${hour}:${minute}`
    } else if (time.toLowerCase().includes('pm')) {
        const hour = Number(time.split(':')[0].replace(/(am|pm)/i, ''))
        const minute = Number(time.split(':')[1].replace(/(am|pm)/i, ''))
        return `${hour + 12}:${minute}`
    }
    else {
        return time
    }
    // might need to add in the function to make sure that each hour and number have the approptiate number of zero's
}

const convertTo12Hour = (time) => {
    const hour = Number(time.split(':')[0])
    let minute = (time.split(':')[1])
    if (minute.length === 1) {
        minute = '0' + minute
    }
    if (hour > 12) {
        return `${hour - 12}:${minute} pm`
    } else {
        return `${hour}:${minute} am`
    }
}

function calculateAvailableTimeSlots(startTime, endTime, blockedTime) {

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
        if (hour >= 12) {
            hour != 12 ? hour -= 12 : hour = 12
            const minute = currentTime % 60
            if (minute === 0) {
                hour += ':00 pm'
            } else {
                hour += `:${minute} pm`
            }
        } else {
            const minute = currentTime % 60
            if (minute === 0) {
                hour += ':00 am'
            } else {
                hour += `:${minute} am`
            }
        }
        
        availableTimes.push(hour)
        currentTime += intervalInMinutes
    }
    return availableTimes
}

function filterArrayByWeekday(date, filter) {
    if (date < new Date().setHours(0, 0, 0, 0)) {
        return true
    }

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase()
    if (filter.includes(dayOfWeek)) {
        return true
    }

    return false
}

function insertColonIfNeeded(str) {
    if (!str.includes(':')) {
        str = str.slice(0, 2) + ':' + str.slice(2)
    }
    return str
}

function stripDate(date) {
    return (String(date).split('G')[0])
}

function stripTime(time) {
    return insertColonIfNeeded((String(time).split('-')[1]).split(' ')[0])
}

const getEndTime = (bookedMin, startTime) => {
    console.log(bookedMin, startTime, 'bookedMin, startTime')
    const startTime24Hour = convertTo24Hour(startTime)
    const hour = Number(startTime24Hour.split(':')[0])
    const minute = Number(startTime24Hour.split(':')[1])
    const bookedMinNumber = Number(bookedMin.split(' ')[0])
    const endTime = hour * 60 + minute + Number(bookedMinNumber)
    const endTime12Hour = `${Math.floor(endTime / 60)}:${endTime % 60}`
    return `${endTime12Hour}`
}

function filterCurretnlyBookedByDate(currentlyBooked, date, bookedMin, interval) {
    
    const dateStamp = stripDate(date)
    currentlyBooked = currentlyBooked.filter(item => stripDate(item) === dateStamp)
    currentlyBooked = currentlyBooked.map(item => convertTo12Hour(stripTime(item)))
    currentlyBooked = currentlyBooked.map(item => {
        const startTime = convertTo24Hour(item)
        const endTime = getEndTime(bookedMin, item)
        const blockedTimes = calculateAvailableTimeSlots(
            startTime.split(' ')[0].trim(' '), 
            endTime.split(' ')[0].trim(' '), 
            interval)
        return blockedTimes
    }
    )

    return currentlyBooked
}

function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0') // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, '0')
  
    return `${year}-${month}-${day}`
}

function formatTimeZoneOffset(offsetInMinutes) {
    const sign = offsetInMinutes < 0 ? '-' : '+'
    const hours = Math.floor(Math.abs(offsetInMinutes) / 60)
    const minutes = Math.abs(offsetInMinutes) % 60
  
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

function convertToISO8601(date, time) {

    const dateTimeString = `${formatDateToYYYYMMDD(date)}T${time}`
    const dateTime = new Date(dateTimeString)
    const timeZoneOffset = formatTimeZoneOffset(-dateTime.getTimezoneOffset())

    return `${dateTimeString}:00.000${timeZoneOffset}`
}

// formats time in ISO format with a timezone offset
function formatTime(time, date, timeZone) {
    const [hours, minutes] = time.split(':')

    const formattedHours = hours.length === 1 ? `0${hours}` : hours
    const formattedMinutes = minutes.length === 1 ? `0${minutes}` : minutes
    const formattedTime = `${formattedHours}:${formattedMinutes}`
    const formattedIsoTime = convertToISO8601(date, formattedTime, timeZone)

    return formattedIsoTime
}

const timesInADay12Hour = Array.from({ length: 12 }, (_, index) => {
    const hour = index === 0 ? 12 : index > 9 ? index : `0${index}`
    return `${hour}:00 AM`
}).concat(Array.from({ length: 12 }, (_, index) => {
    const hour = index === 0 ? 12 : index > 9 ? index : `0${index}`
    return `${hour}:00 PM`
}))

export {
    calculateAvailableTimeSlots,
    filterArrayByWeekday,
    convertTo12Hour,
    convertTo24Hour,
    filterCurretnlyBookedByDate,
    getEndTime,
    formatTime,
    timesInADay12Hour
}