import React, { useState } from "react";
import { bookingFormInfoContext } from "../context/bookingFormInfoContext";

const bookingFormInfoProvider = ({children}) => {
    
    const [bookingFormInfo, setBookingFormInfo] = useState(null);
    
    const setBookingFormInfoWrapper = (props) => {
        setBookingFormInfo(props)
    }
    
  
    return ( 
        <bookingFormInfoContext.Provider value = {{ bookingFormInfo, setBookingFormInfoWrapper }}>
            {children}
        </bookingFormInfoContext.Provider>
    )
}
export default bookingFormInfoProvider;