import React, { createContext, useState, useContext } from 'react'
import { openController } from 'services/http'
import { useEffect } from 'react'

// Create the context
const BookingFormInfoContext = createContext()

// Create the provider component
const BookingFormInfoProvider = ({ children }) => {
  
    const [bookingFormInfo, setBookingFormInfo] = useState(null)

    useEffect(() => {
        let sid = localStorage.getItem("sid")
        sid = JSON.parse(sid)

        if (sid === null) {
            console.log('pass')
            setBookingFormInfo(null)
        } else {
            let { id, providerId } = sid
            openController.getUserBookingInfoByID(id)
                .then(({data}) => {
                    if (!data || data === "") {
                        console.log("No booking form found", data, "logging out")
                    }
                    setBookingFormInfo(data)
                })
                .catch(error => {
                    console.error(error)
                })
        }
    }, [])

    const getBookingInfo = () => {
        return bookingFormInfo
    }

    // Provide the state and methods to the child components
    const contextValue = {
        bookingFormInfo,
        setBookingFormInfo,
        getBookingInfo
    }

    return <BookingFormInfoContext.Provider value={contextValue}>{children}</BookingFormInfoContext.Provider>
}

// Custom hook to access the context
const useBookingFormInfoContext = () => {
    return useContext(BookingFormInfoContext)
}

export { BookingFormInfoProvider, useBookingFormInfoContext, BookingFormInfoContext }