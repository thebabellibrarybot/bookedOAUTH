import { Calendar, ImageGrid, ImageDisplay } from 'components/forms'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { openController } from 'services/http'
import { MdLocationPin } from "react-icons/md"
import { BasicButton, RadioButtons, SizeTextBox } from 'components/buttons'
import { useNavigate } from 'react-router-dom'
import { getEndTime, convertTo24Hour, formatTime } from '../services/time'
import { validateFormFields } from 'services/utils'


const BookingFormInfo = () => {

    const { id } = useParams('prac')
    let navigate = useNavigate()
    const [messageError, setMessageError] = useState("")
    const [bookingFormInfo, setBookingFormInfo] = useState(null)
    const [userEntry, setUserEntry] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        startTime: '',
        endTime: '',
        time: '',
        message: '',
        image: [],
        size: '',
        waiver: false,
        timeZone: '',
        bookedString: '',
        linkBase: useParams()
    })

    const [imageSrc, setImageSrc] = useState('')

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

    // effect that grabs presigned urls
    useEffect(() => {
        // Fetch or generate the pre-signed URL here
        const fetchImageURL = async () => {
            if (bookingFormInfo) {
                try {
                    // Replace 'YOUR_SERVER_ENDPOINT' with the endpoint that generates the pre-signed URL
                    const response = await openController.getS3Image(bookingFormInfo.adminInfo.backgroundImage)
                    setImageSrc(response.data)
                } catch (error) {
                    console.error('Error fetching image URL:', error)
                }
            }
        }

        fetchImageURL()
    }, [bookingFormInfo])
    

    // Function to handle changes in the input fields
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setUserEntry({
            ...userEntry,
            [name]: value,
        })
    }

    // prac function to handle submission of the form
    const fire = async () => {

        const entryObject = {
            userEntry: userEntry,
            bookingFormInfo: bookingFormInfo
        }
        const reqObjest = {
            email: userEntry.email,
            name: userEntry.name,
            lastName: userEntry.lastName,
            phone: userEntry.phone,
            date: userEntry.date,
            startTime: userEntry.startTime,
            endTime: userEntry.endTime,
            timeZone: userEntry.timeZone,
        }
        const isValid = validateFormFields(reqObjest)
        if (!isValid) {

            setMessageError('')
            const res = await openController.postSchedule(entryObject)
            if (res) {
                console.log(res, 'res from fire')
                navigate(`/bookingform/${id}/success`, {state: res.data})
            } else (error) => {
                console.log(error, 'error from fire')
                setMessageError(error)
            }
        } else {
            setMessageError(isValid)
        }

    }

    const callBackTrigger = (e) => {

        const startTime = convertTo24Hour(e.time)
        const endTime = (getEndTime(bookingFormInfo.calendarInfo.bookedMin, e.time))

        setUserEntry((prevUserEntry) => ({
            ...prevUserEntry,
            date: e.date,
            time: e.time,
            timeZone: e.timeZone,
            startTime: formatTime(startTime, e.date),
            endTime: formatTime(endTime, e.date),
            bookedString: String(e.date).split('-')[0] + `-${e.time} (${e.timeZone})`
        }))
    }
    // i can probably normalize and these into one function 
    const handleSizeCallBack = (e) => {
        setUserEntry((prevUserEntry) => ({
            ...prevUserEntry,
            size: e
        }))
    }

    const handleImageCallBack = (e) => {
        setUserEntry((prevUserEntry) => ({
            ...prevUserEntry,
            image: e
        }))
    }

    const handleMessage = (newText) => {
        setUserEntry({
            ...userEntry,
            message: newText
        })
    }

    if (bookingFormInfo === null) {
        return (
            <p>loading</p>
        )
    } else 
    
    {
        const headerStyle = {
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: '100% auto',
            backgroundPosition: 'center',
        }

        return (

            <div className='content'>

                <div className="form-banner nameImage" style = {headerStyle}>
                    {bookingFormInfo.adminInfo.nameImage ? <ImageDisplay s3key = {bookingFormInfo.adminInfo.nameImage}></ImageDisplay> : <h1>cant show image</h1>}
                </div>
                <div className="form-header">
                    <ImageDisplay s3key = {bookingFormInfo.adminInfo.profileImage}></ImageDisplay> 
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

                <br></br>

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

                    <h3 style = {{textAlign: "left"}}>{"What would you like to get tattooed?"}</h3>
                    <ImageGrid customOptions = {bookingFormInfo.tattooInfo.customOptions} flashImages = {bookingFormInfo.tattooInfo.flashImages} callBack = {handleImageCallBack}/>

                    <br></br>

                    <RadioButtons arr = {[bookingFormInfo.tattooInfo.small, bookingFormInfo.tattooInfo.medium, bookingFormInfo.tattooInfo.large]} header = 'Flash Size Options' callBack = {handleSizeCallBack}/>

                    <br></br>
                    <h3 style = {{textAlign: "left"}}>{"Any additional details?"}</h3>
                    <SizeTextBox value = {userEntry.message} callbackFunction = {handleMessage}/>

                </div>

                <div className='form-line'>
                    <Calendar bookingFormInfo={bookingFormInfo} callBackTrigger={callBackTrigger}/>
                </div>    
                

                {
                /*<div className='waiver'>
                    <p>{"click to say you've read and sign"}</p>
                    <p>onclick datetime stamp</p>
                </div>

                <div className = 'reciept'>
                    <p>reciept of booking</p>
                    <p>onclick datetime stamp</p>
                </div>

                <div className='deposits'>
                    <p>deposit amount and venmo link with svg</p>
                </div>*/
                }

                <div className='form-body form-line'>
                    {messageError ? <p>{messageError}</p> : null}
                    <BasicButton text = {"Submit button"} onClick={fire} className={'active-button'} style = {{backgroundColor: "rgba(255, 255, 255, 0.166)"}}/>

                </div>
            </div>
        )
    }
}

export default BookingFormInfo