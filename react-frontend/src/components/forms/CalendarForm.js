import React, { useState } from 'react'
import { arrayToText } from 'services/utils'

const CalendarForm = ({ calendarInfo, callBackFunction }) => {

    const { blockedWeekDates, availableTimes, location } = calendarInfo
    const [ state, setState ] = useState({
        blockedWeekDates,
        availableTimes,
        location,
    })
    const [ isValueChanged, setIsValueChanged ] = useState({
        blockedWeekDates: false,
        availableTimes: false,
        location: false,
    })
    const handleInputChange = (e, fieldName) => {
        console.log(e.target.value, fieldName, 'e.target.value')
        setState({
            ...state,
            [fieldName]: e.target.value,
        })
        setIsValueChanged({
            ...isValueChanged,
            [fieldName]: true,
        })
        callBackFunction({
            ...state,
            [fieldName]: e.target.value,
        }, fieldName, 'calendarInfo')
    }

    return (
        <div>
            <div className="form-grid">
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Blocked Days</p>
                <input
                    type="text"
                    name="name"
                    placeholder='i.e. "mon, sun"'
                    value={isValueChanged.blockedWeekDates ? arrayToText(state.blockedWeekDates) : ''}
                    onChange = {(e)=>handleInputChange(e, 'blockedWeekDates')}
                />
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Availible Times</p>
                <input  
                    type="text"
                    name="name"
                    placeholder='i.e. "9:00am - 5:00pm"'
                    value={isValueChanged.availableTimes ? arrayToText(state.availableTimes) : ''}
                    onChange = {(e)=>handleInputChange(e, 'availableTimes')}
                />
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Appointment Address</p>
                <input
                    type="text"
                    name="location"
                    placeholder='i.e. "1234 Main St, City, State Zip"'
                    value={isValueChanged.location ? state.location : ''}
                    onChange = {(e)=>handleInputChange(e, 'location')}
                />
            </div>
        </div>
    )
}
export default CalendarForm