import { Calendar, ImageGrid } from 'components/forms'
import { RadioButtons } from 'components/buttons'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { openController } from 'services/http'
import { MdLocationPin } from "react-icons/md"
import { BasicButton } from 'components/buttons'

const BookingFormInfo = () => {

    const { id } = useParams('prac')
    const [bookingFormInfo, setBookingFormInfo] = useState(null)
    const [userEntry, setUserEntry] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: '',
        image: [],
        size: '',
        waiver: false,
    })
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [activeAvailableTimes, setActiveAvailableTimes] = useState(null)

    // effect that loads the booking form info from the database
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await openController.getUserBookingInfoByID(id)
                if (res) {
                    setBookingFormInfo(res.data)
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }
        fetchData()
    }, [id, setBookingFormInfo])

    // Function to handle changes in the input fields
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setUserEntry({
            ...userEntry,
            [name]: value,
        })
    }

    // function to handle selection of a date and filter for available times (google API req)
    const handleAvailableTimes = (e) => {
        const {name, value} = e
    }

    // function to handle submission of the form
    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitted(true)
    }

    // prac function to handle submission of the form
    const fire = () => {

        openController.sendBookingEmail("schedule")

    }

    if (bookingFormInfo === null) {
        return (
            <p>loading</p>
        )
    } else 
    
    {
        const headerStyle = {
            backgroundImage: `url(${bookingFormInfo.adminInfo.backgroundImage})`,
            backgroundSize: '100% auto',
            backgroundPosition: 'center',
        }
        return (

            <div className='content'>

                <div className="form-banner" style = {headerStyle}>
                    {bookingFormInfo.adminInfo.nameImage ? <img src = {bookingFormInfo.adminInfo.nameImage} alt = 'nameImage'></img> : <h1>{bookingFormInfo.adminInfo.displayName}</h1>}
                </div>

                <div className="form-header">
                    <img src = {bookingFormInfo.adminInfo.profileImage} alt = 'basic profile image'></img>
                    
                    <div className='form-bio'>
                        <h3>{bookingFormInfo.adminInfo.displayName}</h3>
                        <div style = {{display: 'flex'}}>
                            <MdLocationPin className='icon-sm'/>
                            <p>{bookingFormInfo.adminInfo.location}: {bookingFormInfo.adminInfo.locationDates}</p>
                        </div>
                    </div>
                </div>

                <div className='form-header'>
                    <p>{bookingFormInfo.adminInfo.bio}</p>
                </div>

                <div className="form-header form-grid">
                    <p>First Name</p>
                    <input
                        type="text"
                        name="name"
                        value={userEntry.name}
                        onChange={handleInputChange}
                    />
                    <p>Last Name</p>
                    <input
                        type="text"
                        name="lastName"
                        value={userEntry.lastName}
                        onChange={handleInputChange}
                    />
                    <p>Email</p>
                    <input
                        type="email"
                        name="email"
                        value={userEntry.email}
                        onChange={handleInputChange}
                    />
                    <p>Phone Number</p>
                    <input
                        type="tel"
                        name="phone"
                        value={userEntry.phone}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-line">

                    <ImageGrid customOptions = {bookingFormInfo.tattooInfo.customOptions} flashImages = {bookingFormInfo.tattooInfo.flashImages}/>

                    <RadioButtons arr = {[bookingFormInfo.tattooInfo.small, bookingFormInfo.tattooInfo.medium, bookingFormInfo.tattooInfo.large]} header = 'flash'/>

                    <br></br>

                    <h3>{"Any details you'd like to add?"}</h3>
                    <input></input>

                    <br></br>

                    <h3>Reserve a time</h3>
                    <Calendar bookingFormInfo={bookingFormInfo}/>


                </div>

                <div className='waiver'>
                    <p>{"click to say you've read and sign"}</p>
                    <p>onclick datetime stamp</p>
                </div>

                <div className = 'reciept'>
                    <p>reciept of booking</p>
                    <p>onclick datetime stamp</p>
                </div>

                <div className='deposits'>
                    <p>deposit amount and venmo link with svg</p>
                </div>

                <div className='form-body'>
                    
                    <BasicButton text = {"fire postBooking"} onClick={fire}/>

                </div>
            </div>
        )
    }
}

export default BookingFormInfo


/*
submit will send an email to the user with their request, the reciept, a link to the calendar appointment, and a link to the venmo deposit
submit will also send an email to the admin with the user request, the reciept, a link to the calendar appointment and a approve or deny button and the users instagram acct and phone number
*/