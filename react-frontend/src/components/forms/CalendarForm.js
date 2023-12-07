import { RadioButtons } from 'components/buttons'
import React, { useEffect, useState } from 'react'
import { timesInADay12Hour } from 'services/time'
import RotaryList from './RotaryList'

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
        setState({
            ...state,
            [fieldName]: e.target.value,
        })
        setIsValueChanged({
            ...isValueChanged,
            [fieldName]: true,
        })
        callBackFunction({
            ...calendarInfo,
            [fieldName]: e.target.value,
        }, fieldName, 'calendarInfo')
    }
    const handleSelectChange = (e, fieldName) => {
        setState({
            ...state,
            [fieldName]: e,
        })
        setIsValueChanged({
            ...isValueChanged,
            [fieldName]: true,
        })
        callBackFunction({
            ...calendarInfo,
            [fieldName]: e,
        }, fieldName, 'calendarInfo')
    }

    useEffect(() => {
        const availableTimes = `${state.availableStart}-${state.availableEnd}`
        if (availableTimes !== 'undefined-undefined') {

            callBackFunction({
                ...calendarInfo,
                availableTimes: availableTimes?availableTimes:calendarInfo.availableTimes,
            }, 'availableTimes', 'calendarInfo')
        }
    }, [state.availableStart, state.availableEnd])

    return (
        <div>
            <div>
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Blocked Days</p>
                <RadioButtons arr = {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']} callBack = {(e) => handleSelectChange(e, 'blockedWeekDates')} header = 'Blocked Days' radioRow = {true} selectMult = {true}/>
            </div>
            <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Time / Availability</p>
            <div className='form-grid'>
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Opening Time</p>
                <p  style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Closing Time</p>
                <RotaryList options = {timesInADay12Hour} callbackFunction = {(e) => handleSelectChange(e, 'availableStart')}/>
                <RotaryList options = {timesInADay12Hour} callbackFunction = {(e) => handleSelectChange(e, 'availableEnd')}/>
            </div>
            <div className="form-grid">
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