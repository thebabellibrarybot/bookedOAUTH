import { Calendar, ImageGrid } from 'components/forms'
import { RadioButtons } from 'components/buttons'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { openController } from 'services/http'
//import useBookingFormInfo from '../hooks/useBookingFormInfo'


const BookingFormInfo = () => {

    const { id } = useParams('prac')

    // get request to find all form info for this link
    const [bookingFormInfo, setBookingFormInfo] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await openController.getUserBookingInfoByID(id)
                if (res) {
                    console.log(res.data, 'res from bookingForm.js')
                    setBookingFormInfo(res.data)
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }
        fetchData()
    }, [id, setBookingFormInfo])


    const [userEntry, setUserEntry] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: '',
    })

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [activeAvailableTimes, setActiveAvailableTimes] = useState(null)

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

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitted(true)
    }

    if (bookingFormInfo === null) {
        return (
            <p>loading</p>
        )
    } else 
    
    {
        const headerStyle = {
            backgroundImage: `url(${bookingFormInfo.adminInfo.backgroundImage})`
        }

        console.log(bookingFormInfo, 'bookingFormInfo from bookingForm.js')

        return (

            <div className='content'>

                <div className="form-banner" style = {headerStyle}>
                    {bookingFormInfo.adminInfo.nameImage ? <img src = {bookingFormInfo.adminInfo.nameImage} alt = 'nameImage' id = 'nameImage'></img> : <h1>{bookingFormInfo.adminInfo.displayName}</h1>}
                </div>

                <div className="form-header">
                    <img src = {bookingFormInfo.adminInfo.profileImage} alt = 'basic profile image'></img>
                    
                    <div className='form-bio'>
                        <h3>{bookingFormInfo.adminInfo.displayName}</h3>
                        <div style = {{display: 'flex'}}>
                            <p>location icon </p>
                            <p>{bookingFormInfo.adminInfo.location}: {bookingFormInfo.adminInfo.locationDates}</p>
                        </div>
                        <p>{bookingFormInfo.adminInfo.bio}</p>
                    </div>
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
                    <button>submit booking / booking and payment</button>
                </div>
            </div>


        )
    }
}

export default BookingFormInfo