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
    const start24Hour = startTime
    const end24Hour = endTime

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
    if (date < new Date()) {
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
    const startTime24Hour = convertTo24Hour(startTime)
    const hour = Number(startTime24Hour.split(':')[0])
    const minute = Number(startTime24Hour.split(':')[1])
    const endTime = hour * 60 + minute + Number(bookedMin)
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

export {
    calculateAvailableTimeSlots,
    filterArrayByWeekday,
    convertTo12Hour,
    convertTo24Hour,
    filterCurretnlyBookedByDate
}