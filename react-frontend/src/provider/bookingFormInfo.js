import React, { createContext, useState, useContext } from 'react'
import { openController } from 'services/http'
import { useEffect } from 'react'

// Create the context
const BookingFormInfoContext = createContext()

// Create the provider component
const BookingFormInfoProvider = ({ children }) => {
  
    const [bookingFormInfo, setsBookingFormInfo] = useState(null)

    const setBookingFormInfo = (bookingFormInfo) => {
        setsBookingFormInfo(bookingFormInfo)
        localStorage.setItem("bookingFormInfo", JSON.stringify(bookingFormInfo))
    }

    const getLocalBookingFormInfo = () => {
        return JSON.parse(localStorage.getItem("bookingFormInfo"))
    }

    const getBookingInfo = () => {
        if (bookingFormInfo) {
            return bookingFormInfo
        } else if (bookingFormInfo === null) {
            const bookingFormInfoLocal = getLocalBookingFormInfo()
            return bookingFormInfoLocal
        }
        return bookingFormInfo
    }
    const removeLocalBookingFormInfo = () => {
        localStorage.removeItem("bookingFormInfo")
    }


    // Provide the state and methods to the child components
    const contextValue = {
        bookingFormInfo,
        setBookingFormInfo,
        getBookingInfo,
        removeLocalBookingFormInfo,
        getLocalBookingFormInfo,
    }

    return <BookingFormInfoContext.Provider value={contextValue}>{children}</BookingFormInfoContext.Provider>
}

// Custom hook to access the context
const useBookingFormInfoContext = () => {
    return useContext(BookingFormInfoContext)
}

export { BookingFormInfoProvider, useBookingFormInfoContext, BookingFormInfoContext }