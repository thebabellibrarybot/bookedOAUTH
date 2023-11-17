import { Calendar, ImageGrid } from 'components/forms'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { openController } from 'services/http'
import { MdLocationPin } from "react-icons/md"
import { BasicButton, GoogleOAuth2Button, LogoutButton, RadioButtons, SizeTextBox } from 'components/buttons'
import { authController, serviceController } from 'services/http'
import { useNavigate } from 'react-router-dom'
import { CONST } from '../config'
import { getEndTime, convertTo24Hour, formatTime } from '../services/time'

const BookingFormInfo = (props) => {

    const handleLogin = props.handleLogin
    const handleLogout = props.handleLogout
    const [loggedIn, setLoggedIn] = useState(false)
    const { id } = useParams('prac')
    let navigate = useNavigate()
    const [isGoogleAvailable, setIsGoogleAvailable] = useState(false)
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

    // effect that handles the auth for the form
    useEffect(() => {
        let isUserAuthenticated = localStorage.getItem("sid")
        if (isUserAuthenticated) {
            handleLogin()
            setLoggedIn(true)
            return navigate(`/bookingform/${id}`)
        } else {
            handleLogout()
            setLoggedIn(false)
        }
        
        serviceController.isOAuth2GoogleAvailable()
            .then(response => {
                let { serviceName, isActive }= response.data
                console.log(`${serviceName} status: ${isActive ? "Available" : "Not available"}`)
                setIsGoogleAvailable(isActive)
            })

    }, [])

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
        console.log('fired entryObject', entryObject)
        const res = await openController.postSchedule(entryObject)
        if (res) {
            console.log(res, 'res from fire')
            // navigate(`/bookingform/${id}/success`, {state: res.data})
        }
    }

    const logout = () => {
        handleLogout()
        setLoggedIn(false)
        localStorage.removeItem("sid")
        navigate(`/bookingform/${id}`)
    }
    // i can probably outsource these three functions since they are reused in several places...
    const startWithGoogle = function (e) {
        e.preventDefault()
        authController.startWithOAuth2(CONST.uri.auth.GOOGLE_LOGIN)
            .then(onSuccessLogin)
            .catch(onFailLogin)
    }

    const onSuccessLogin = function ({data}) {
        let { sid } = data

        if (!sid) {
            let error = "An error occurred during the login process"
            console.log(error)
            setMessageError(error)
            return
        }
        setUserEntry({
            ...userEntry,
            email: sid.email
        })
        setLoggedIn(true)
        localStorage.setItem("sid", JSON.stringify(sid))
        handleLogin()
        navigate(`/bookingform/${id}`)
    }

    const onFailLogin = function (error) {
        if (typeof error !== "object" && !error.response?.data) {
            return console.log(error)
        }
        error = error.response.data.error
        setLoggedIn(false)
        setMessageError(error)
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
                

                {/*<div className='waiver'>
                    <p>{"click to say you've read and sign"}</p>
                    <p>onclick datetime stamp</p>
                </div>

                <div className = 'reciept'>
                    <p>reciept of booking</p>
                    <p>onclick datetime stamp</p>
                </div>

                <div className='deposits'>
                    <p>deposit amount and venmo link with svg</p>
        </div>*/}

                <div className='form-body form-line'>

                    {loggedIn ? <h2 className='mb-3'>Logout</h2> : <h2 className='mb-3'>Log in</h2>}

                    {loggedIn ? <LogoutButton textContent={"Logout"} onClick={logout}/> : <GoogleOAuth2Button onClick={startWithGoogle} />}
                    
                    <BasicButton text = {"Submit button"} onClick={fire} className={loggedIn ? 'active-button' : 'inactive-button'} style = {{backgroundColor: "rgba(255, 255, 255, 0.166)"}}/>

                </div>
            </div>
        )
    }
}

export default BookingFormInfo