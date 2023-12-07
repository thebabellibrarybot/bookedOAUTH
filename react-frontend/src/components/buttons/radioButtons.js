import React, { useState } from 'react'

const RadioButtons = (props) => {

    const [selected, setSelected] = useState([])

    const handleChange = (e) => {
        let back = []
        setSelected((prevSelected) => {
            if (prevSelected.includes(e)) {
                return prevSelected.filter((item) => item !== e)
            } else
            if (props.selectMult) {
                return [...prevSelected, e]
            } else {
                return [e]
            }
        })
        if (props.selectMult) {
            if (selected.includes(e)) {
                back = selected.filter((item) => item !== e)
            } else
                back = [...selected, e]
        } else {
            back = e
        }

        props.callBack(back)
    }

    if (props.selectMult) return (
        <div className='radio-row'>
            {props.arr.map((item, index) => {
                return (
                    <div className= 'radio-button' key = {index} onClick = {() => handleChange(item)}>
                        <p className={selected.includes(item) ? 'selected' : 'unselected'}>{item}</p>
                    </div>
                ) 
            })}
        </div>
    )
    return (
        <div className='radio-selector'>
            <h3>{props.header}</h3>
            {props.arr.map((item, index) => {
                return (
                    <div className= 'radio-button' key = {index} onClick = {() => handleChange(item)}>
                        <p className={item === selected ? 'selected' : 'unselected'}>{item}</p>
                    </div>
                ) 
            })}
        </div>
    )
}
export default RadioButtons