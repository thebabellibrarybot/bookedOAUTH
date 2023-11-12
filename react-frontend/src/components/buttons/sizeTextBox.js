// SizeTextBox.js
import React, { useState, useEffect } from 'react'

const SizeTextBox = ({ value, placeholder, callbackFunction }) => {
    const maxCharacters = 500 // Set the maximum character limit
    const [text, setText] = useState(value || '') // Initialize with the provided value or an empty string

    useEffect(() => {
        // Trim the text if it exceeds the character limit
        if (text.length > maxCharacters) {
            setText(text.slice(0, maxCharacters))
        }

        // Invoke the callback function with the current text whenever it changes
        callbackFunction(text)
    }, [text, callbackFunction, maxCharacters])

    const handleTextChange = (event) => {
        const newText = event.target.value

        // Check if the new text exceeds the character limit
        if (newText.length <= maxCharacters) {
            setText(newText)
        }
    }

    const calculateRows = () => {
        const rowCount = text.split('\n').length
        return Math.max(1, rowCount)
    }

    return (
        <textarea
            className="size-text-box"
            value={text}
            onChange={handleTextChange}
            rows={calculateRows()}
            placeholder={placeholder}
        />
    )
}

export default SizeTextBox