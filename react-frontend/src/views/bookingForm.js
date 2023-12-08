import { Calendar, ImageGrid, ImageFlashUploadForm } from 'components/forms'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { openController } from 'services/http'
import { FormUserInfo } from '../components/forms'
import { BasicButton, SizeTextBox } from 'components/buttons'
import { useNavigate } from 'react-router-dom'
import { getEndTime, convertTo24Hour, formatTime } from '../services/time'
import { validateFormFields } from 'services/utils'
import { IoLogoVenmo } from "react-icons/io5"
import { SiCashapp, SiPaypal } from "react-icons/si"
import Spinner from './Spinner'
import { GrSend } from "react-icons/gr"

const BookingFormInfo = () => {

    const { id } = useParams('prac')
    let navigate = useNavigate()
    const [messageError, setMessageError] = useState("")
    const [bookingFormInfo, setBookingFormInfo] = useState(null)
    const [userEntry, setUserEntry] = useState({
        scheduleId: null,
        name: '',
        email: '',
        phone: '',
        date: '',
        startTime: '',
        endTime: '',
        time: '',
        message: '',
        image: [],
        customFlash: [],
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

    const fire = async () => {
        const entryObject = {
            userEntry: userEntry,
            bookingFormInfo: bookingFormInfo
        }
        console.log(entryObject, 'entryObject')

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
                navigate(`/bookingform/${id}/${res.data.updatedBookingSchedule._id}/success`)
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

    const handleCallBackField = (e, value) => {
        setUserEntry((prevUserEntry) => ({
            ...prevUserEntry,
            [value]: e.flashImages
        }))
    }

    const handlecustomFlashCallBack = (e) => {
        setUserEntry((prevUserEntry) => ({
            ...prevUserEntry,
            customFlash: e.customFlash,
            scheduleId: e._id
        }))
    }

    const handleMessage = (newText) => {
        setUserEntry({
            ...userEntry,
            message: newText
        })
    }

    console.log(userEntry, 'userEntry')

    if (!bookingFormInfo) {
        return (
            <Spinner/>
        )
    } else
    if (bookingFormInfo === null) {
        return (
            <Spinner/>
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

                <FormUserInfo user = {null} bookingFormInfo = {bookingFormInfo} headerStyle = {headerStyle}></FormUserInfo>

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
                    <p>Upload Custom Image</p>
                    <ImageFlashUploadForm maxImages={3} callBackFunction = {handlecustomFlashCallBack} type = 'customFlash' uploadType='sendflashtoschedule'/>
                    
                    <br></br>

                    {bookingFormInfo.tattooInfo.flashImages.length > 1 ? 
                        <>
                            <p>Select From Flash</p>
                            <ImageGrid tattooInfo = {bookingFormInfo.tattooInfo} callBack = {handleCallBackField} field = 'flashImages'/>
                        </> : null}
                   
                    {/*<RadioButtons arr = {[bookingFormInfo.tattooInfo.small, bookingFormInfo.tattooInfo.medium, bookingFormInfo.tattooInfo.large]} header = 'Flash Size Options' callBack = {handleSizeCallBack}/>*/}

                    <h3 style = {{textAlign: "left"}}>{"Any additional details?"}</h3>
                    <SizeTextBox value = {userEntry.message} callbackFunction = {handleMessage}/>

                </div>

                <div className='form-line'>
                    <Calendar bookingFormInfo={bookingFormInfo} callBackTrigger={callBackTrigger}/>
                </div>    

                {bookingFormInfo.tattooInfo.paymentType ?
                    <div className='form-line'>
                        <h3>Deposit Info</h3>
                        <p style={{display: "flex", width: "100%", textAlign: "left", justifyContent: "left"}}>{bookingFormInfo.tattooInfo.deposits?bookingFormInfo.tattooInfo.deposits:null}</p>
                        <p style={{display: "flex", width: "100%", textAlign: "left", justifyContent: "left"}}>Deposit Amount: {bookingFormInfo.tattooInfo.depositAmount?bookingFormInfo.tattooInfo.depositAmount:null}</p>
                        <br></br>

                        {bookingFormInfo.tattooInfo.paymentType.includes('Venmo') ?
                            <>
                                <BasicButton IconElement={IoLogoVenmo} onClick={()=>window.open(`https://account.venmo.com/u/${bookingFormInfo.tattooInfo.venmo}`)} style={{backgroundColor: "#3D95CE", fill: "white", color: "white"}}/>
                            </>
                            :null}

                        <br></br>

                        {bookingFormInfo.tattooInfo.paymentType.includes('PayPal') ?
                            <>
                                <BasicButton IconElement={SiPaypal} onClick={()=>window.open(`https://paypal.com/${bookingFormInfo.tattooInfo.paypal}`)} style={{backgroundColor: "#003087", fill: "white", color: "white"}}/>
                            </>
                            :null}
                            
                        <br></br>

                        {bookingFormInfo.tattooInfo.paymentType.includes('CashApp') ?
                            <>
                                <BasicButton IconElement={SiCashapp} onClick={()=>window.open(`https://cashapp.com/${bookingFormInfo.tattooInfo.cashapp}`)} style={{backgroundColor: "#3CB371", fill: "white", color: "white"}}/>
                            </>
                            :null}

                        <br></br>

                    
                    </div>
                    :null}


                {
                /*<div className='waiver'>
                    <p>{"click to say you've read and sign"}</p>
                    <p>onclick datetime stamp</p>
                </div>

                <div className = 'reciept'>
                    <p>reciept of booking</p>
                    <p>onclick datetime stamp</p>
                </div>

                <div className='payment'>
                    <p>payment amount and venmo link with svg</p>
                </div>
                */
                }

                <div className='form-body form-line'>
                    {messageError ? <p>{messageError}</p> : null}
                    <BasicButton IconElement={GrSend} onClick={fire} className={'active-button'} style = {{backgroundColor: "rgba(255, 255, 255, 0.166)", borderRadius: "100px", width: "fit-content"}}/>
                </div>
            </div>
        )
    }
}

export default BookingFormInfo