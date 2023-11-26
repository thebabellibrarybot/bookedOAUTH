// SizeTextBox.js
import React, { useState, useEffect } from 'react'

const SizeTextBox = ({ value, placeholder, callbackFunction }) => {
    const maxCharacters = 500 // Set the maximum character limit
    const [text, setText] = useState(value || '') // Initialize with the provided value or an empty string
    const [isValueChanged, setIsValueChanged] = useState(false)

    const handleTextChange = (event) => {
        const newText = event.target.value
        setIsValueChanged(true)
        // Check if the new text exceeds the character limit
        if (newText.length <= maxCharacters) {
            setText(newText)
        }
        callbackFunction(newText)
    }

    const calculateRows = () => {
        const rowCount = text.split('\n').length
        return Math.max(1, rowCount)
    }

    return (
        <textarea
            className="size-text-box"
            value={isValueChanged?text:''}
            onChange={handleTextChange}
            rows={calculateRows()}
            placeholder={text}
        />
    )
}

export default SizeTextBox