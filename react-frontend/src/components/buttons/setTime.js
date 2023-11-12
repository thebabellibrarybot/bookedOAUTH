import React, { useState } from 'react'
import { convertTo24Hour } from 'services/time'


const SetTimeButton = ({availableTimes, currentBookings, header, callBackFunction}) => {

    const [selected, setSelected] = useState(null)

    const handleChange = (e) => {
        setSelected(e)
        callBackFunction(convertTo24Hour(e).replace(':', ''))
    }

    return (
        <div className='radio-selector'>
            <h3>{header}</h3>
            {availableTimes.map((item, index) => {
                if (currentBookings.includes(item)) {
                    return (
                        <div className='radio-button' key = {index}>
                            <p className='blocked'>{item}: blocked</p>
                        </div>
                    )
                } else {
                    return (
                        <div className='radio-button' key = {index} onClick = {() => handleChange(item)}>
                            <p className={item === selected ? 'selected' : 'unselected'}>{item}</p>
                        </div>
                    )
                }
            })}
        </div>
    )
}
export default SetTimeButton