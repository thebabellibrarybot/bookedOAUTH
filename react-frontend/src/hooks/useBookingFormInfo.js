import { useContext } from "react";
import { bookingFormInfoContext } from "../context/bookingFormInfoContext";

const useBookingFormInfo = () => {
    return useContext(bookingFormInfoContext);
};
export default useBookingFormInfo;