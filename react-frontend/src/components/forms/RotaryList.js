// RotaryList.js
import React, { useState, useEffect } from 'react'

const RotaryList = ({ options, callbackFunction }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)

  useEffect(() => {
    // Invoke the callback function with the selected option whenever it changes
    callbackFunction(options[selectedOptionIndex])
  }, [selectedOptionIndex, options, callbackFunction])

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

  return (
    <div className="rotary-list" onWheel={handleScroll}>
      {options.slice(selectedOptionIndex, selectedOptionIndex + 5).map((option, index) => (
        <div key={index} className={`rotary-item ${index === 2 ? 'selected' : ''}`}>
          {option}
        </div>
      ))}
    </div>
  )
}

export default RotaryList
