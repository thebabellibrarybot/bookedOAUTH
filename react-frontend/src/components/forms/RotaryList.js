// RotaryList.js
import React, { useState } from 'react'

const RotaryList = ({ options, callbackFunction }) => {
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
    const [selected, setSelected] = useState(null)

    const handleScroll = (event) => {
        const delta = Math.sign(event.deltaY)

        // Update the selected option index based on scroll direction
        setSelectedOptionIndex((prevIndex) => {
            let newIndex = prevIndex + delta

            // Ensure the index stays within the bounds of the options array
            if (newIndex < 0) {
                newIndex = options.length - 1
            } else if (newIndex >= options.length) {
                newIndex = 0
            }

            return newIndex
        })
    }

    const handleClick = (option) => {
        setSelected(option)
        callbackFunction(option)
    }

    return (
        <div className="rotary-list" onWheel={handleScroll}>
            {options.slice(selectedOptionIndex, selectedOptionIndex + 5).map((option, index) => (
                <div onClick={() => handleClick(option)} key={index} className={`rotary-item ${selected === option ? 'selected' : 'unselected'}`}>
                    {option}
                </div>
            ))}
        </div>
    )
}

export default RotaryList