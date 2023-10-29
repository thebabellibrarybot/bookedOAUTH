import React, { createContext, useState, useContext } from 'react'

// Create the context
const BookingFormInfoContext = createContext()

// Create the provider component
const BookingFormInfoProvider = ({ children }) => {
  
    const [bookingFormInfo, setBookingFormInfo] = useState({})

    // Provide the state and methods to the child components
    const contextValue = {
        bookingFormInfo,
        setBookingFormInfo
    }

    return <BookingFormInfoContext.Provider value={contextValue}>{children}</BookingFormInfoContext.Provider>
}

// Custom hook to access the context
const useBookingFormInfoContext = () => {
    return useContext(BookingFormInfoContext)
}

export { BookingFormInfoProvider, useBookingFormInfoContext, BookingFormInfoContext }