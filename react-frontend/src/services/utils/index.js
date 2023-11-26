const copyTextById = (elementId) => {
    const element = document.getElementById(elementId)

    if (element) {
        const clipboardItem = new ClipboardItem({ 'text/plain': new Blob([element.textContent]) })
        navigator.clipboard.writeText(element.textContent)
            .then(
                () => {
                    console.log('Text copied to clipboard')
                },
                (err) => {
                    console.error('Unable to copy text to clipboard', err)
                }
            )
    } else {
        console.log('Element not found!')
    }
}

const textToWordArray = (text) => {
    // Use a regular expression to split by commas and/or spaces
    console.log(text)
    const words = text.split(/[,\s]+/)

    // Filter out empty strings and words that are just punctuation marks
    const filteredWords = words.filter((word) => {
        // Use a regular expression to check if the word contains at least one alphanumeric character
        return word.trim() !== '' && /\w/.test(word)
    })

    return filteredWords
}

const arrayToText = (wordArray) => {
    // Check if it's an array
    if (!Array.isArray(wordArray)) {
        // If not an array, return the input as is
        return wordArray
    }

    // Join the array elements with a space
    const text = wordArray.join(' ')
    return text
}

const validateFormFields = (formData) => {
    for (const key in formData) {
        if (!formData[key]) {
            console.log(`Cannot submit form, please fill out the "${key}" field.`)
            return `Cannot submit form, please fill out the "${key}" field.`
        }
    }
    console.log('All fields are filled out')
    return null // Return null if all fields are filled out
}

// Example usage:
// copyTextToClipboard('publink')


export {
    copyTextById,
    textToWordArray,
    arrayToText,
    validateFormFields,
}