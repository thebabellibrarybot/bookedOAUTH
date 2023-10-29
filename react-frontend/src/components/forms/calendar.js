import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Radio from "./radioButtons";
import { useState } from "react";

const Calendar = ({bookingFormInfo}) => {

    const today = new Date();
    const [date, setDate] = useState(today);
    const [reacurringUnavailable, setReacurringUnavailable] = useState(false);
    const [viewTimes, setViewTimes] = useState(false);
    const [availableTimes, setAvailableTimes] = useState(null);

    function isDateDisabled(date) {
        return date < today;
      }

    const handleDateChange = (date) => {
    console.log('Selected Date:', date);
    setViewTimes(true);
    setDate(date);
    };

    return (
        <div className="form-line" styles = {{width: '100%', margin: '0'}}>
            <Calendar
            onChange={handleDateChange}
            value={date}
            tileDisabled={({ date }) => isDateDisabled(date)}
            />

            <br></br>

            {viewTimes ? <Radio arr = {bookingFormInfo.tattooInfo.availableTimes} header = 'Select a time:'/> : 'hidden times'}
        </div>
    )
};
export default Calendar;