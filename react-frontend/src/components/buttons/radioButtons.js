import React, { useState } from 'react'

const RadioButtons = (props) => {

    const [selected, setSelected] = useState(null)

    const handleChange = (e) => {
        console.log(e)
        setSelected(e)
        props.callBack(e)
    }

    console.log(props, 'props.booked from RadioButtons')

    return (
        <div className='radio-selector'>
            <h3>{props.header}</h3>
            {props.arr.map((item, index) => {
                return (
                    <div className='radio-button' key = {index} onClick = {() => handleChange(item)}>
                        <p className={item === selected ? 'selected' : 'unselected'}>{item}</p>
                    </div>
                )
            })}
        </div>
    )
}
export default RadioButtons