import React, { useEffect, useState } from 'react'
import { LogoutButton, BasicButton } from 'components/buttons'
import { usersController, openController } from 'services/http'
import { useNavigate } from 'react-router-dom'
import { useBookingFormInfoContext } from 'provider/bookingFormInfo'
import { MdLocationPin } from 'react-icons/md'
import { ImageDisplay } from 'components/forms'
import { copyTextById } from 'services/utils'

function Spinner() {
    return (
        <div className="d-flex flex-column align-items-center">
            <span className="spinner-border text-primary mb-3" role="status" aria-hidden="true"></span>
            Loading...
        </div>
    )
}

function UserInformation ({user, bookingFormInfo}) {
    
    return (
        <div className='content'>
            <div className="form-header">
                <ImageDisplay s3key = {bookingFormInfo.adminInfo.profileImage}></ImageDisplay>
                
                <div className='form-bio'>
                    <h3>{user.fullname.length > 1 ? user.fullname : bookingFormInfo.adminInfo?bookingFormInfo.adminInfo.displayName:user.fullname}</h3>
                    <div style = {{display: 'flex'}}>
                        <MdLocationPin className='icon-sm'/>
                        <p>{bookingFormInfo.adminInfo.location}: {bookingFormInfo.adminInfo.locationDates}</p>
                    </div>
                </div>
            </div>

            <div className="form-header">                
                <div className='form-bio' style = {{ width: "100%", borderRadius: "10px"}}>
                    <p style = {{width: "100%", textAlign: "left"}}>Public Link:</p>
                    <div style = {{display: 'flex', textAlign: 'left'}} onClick={()=>copyTextById('publink')}>
                        <MdLocationPin className='icon-sm'/>
                        <p id='publink' className="size-text-box" style={{textAlign: "left"}}>{`http://localhost:3000/bookingform/${bookingFormInfo.adminId}`}</p>
                    </div>
                </div> 
            </div>
        </div>
    )
}

function HomePage({handleLogout}) {

    const [ userInformation, setUserInformation ] = useState(null)
    const { bookingFormInfo, setBookingFormInfo } = useBookingFormInfoContext(null)
    const defaultBookingFormInfo = {
        adminInfo: {
            displayName: "Default Name",
            bio: 'bio',
            email: 'email',
            profileImage: "654827adc537c9ee74365b2f/profileImage/1700853575168-unnamed.jpg",
            backgroundImage: "654827adc537c9ee74365b2f/profileImage/1700853575168-unnamed.jpg",
            nameImage: "654827adc537c9ee74365b2f/profileImage/1700853575168-unnamed.jpg",
            location: "Default Location",
        },
        tattooInfo: {
            customOptions: [],
            depositAmout: "0",
            flashImages: [],
            hourlyPrice: "0",
            availableColors: [],
            small: "0",
            medium: "0",
            large: "0",
            venmo: "",
            deposits: "",
        },
        themesInfo: {
            themes: "Default Theme",
        },
        calendarInfo: {
            blockedWeekDates: ["Sunday", "Monday"],
            availableTimes: "9:00 AM - 5:00 PM",
            currentlyBooked: [],
            blockTime: "60 min",
            bookedMin: "60 min",
        }
    }

    let navigate = useNavigate()

    useEffect(() => {
        let sid = localStorage.getItem("sid")
        sid = JSON.parse(sid)
        let { id, providerId } = sid
        console.log(sid.id, "sid.id from homePage")

        usersController.getUserById(id, providerId)
            .then(({data}) => {
                if (!data || data === "") {
                    console.log("No user found", data, "logging out")
                    logout()
                }
                console.log(data, 'data from userinfo')
                setUserInformation(data)
            })
            .catch(error => {
                console.error(error)
                logout()
            })

        openController.getUserBookingInfoByID(id)
            .then(({data}) => {
                if (!data || data === "") {
                    console.log("No booking form found", data, "creating default booking form")
                    const defaultBookingFormInfo = {
                        adminId: sid.id,
                        tattooInfo: {
                            customOptions: [],
                            flashImages: [],
                            hourlyPrice: "0",
                            availableColors: [],
                            small: "5",
                            medium: "10",
                            large: "15",
                            venmo: "myurl",
                            deposits: "please deposit $50 to confirm booking, expect to pay an additional $200 at the end of the session"
                        },
                        adminInfo: {
                            displayName: "Default Name",
                            bio: "Default Bio",
                            email: sid.email,
                            profileImage: "654827adc537c9ee74365b2f/profileImage/1700853575168-unnamed.jpg",
                            backgroundImage: "654827adc537c9ee74365b2f/profileImage/1700853575168-unnamed.jpg",
                            nameImage: "654827adc537c9ee74365b2f/profileImage/1700853575168-unnamed.jpg",
                            location: "Default Location",
                        },
                        themesInfo: {
                            themes: "Default Theme",
                        },
                        calendarInfo: {
                            blockedWeekDates: ["Sunday", "Monday"],
                            availableTimes: "9:00 AM - 5:00 PM",
                            currentlyBooked: [],
                            blockTime: "60 min",
                            bookedMin: "60 min",
                        }
                    }
                    //alert("Hello New User! Please create a booking form")
                    setBookingFormInfo(defaultBookingFormInfo)
                }
                if (data) {
                    console.log("booking form found", data)
                    setBookingFormInfo(data)
                }
            })
            .catch(error => {
                console.error(error)
            })
    }, [])

    const logout = () => {
        handleLogout()
        localStorage.removeItem("sid")
        navigate("/")
    }

    const style = (test, base) => {
        if (test === base) {
            console.log(base, 'needs attention')
            return {
                backgroundColor: "red",
                padding: "0",
                margin: "0"
            }
        }
        console.log(base, test,'does not need attention')
        return {
            backgroundColor: "rgba(255, 255, 255, 0.166)",
            padding: "0",
            margin: "0"
        }
    }

    if (userInformation === null){
        return <Spinner />
    }
    if  (bookingFormInfo === null) {
        return <Spinner />
    }
    if (bookingFormInfo.adminInfo) {

        const profileStyle = style(bookingFormInfo.adminInfo.displayName, defaultBookingFormInfo.adminInfo.displayName)
        const bookingStyle = style(bookingFormInfo.tattooInfo.hourlyPrice, defaultBookingFormInfo.tattooInfo.hourlyPrice)
       
        return (
            <div className='content'>

                {bookingFormInfo ? <UserInformation user={userInformation} bookingFormInfo={bookingFormInfo}/> : <UserInformation user={userInformation} bookingFormInfo={defaultBookingFormInfo}/>}

                <div className='form-line'>
                    <BasicButton style = {profileStyle} className = "active-button" text = {"Edit Profile"} onClick={()=>navigate("/editprofile")}/>
                    <BasicButton style = {bookingStyle} className = "active-button" text={"Edit Booking Form"} onClick={() => navigate("/editbookingform")}/>
                    <BasicButton style = {{backgroundColor: "rgba(255, 255, 255, 0.166)"}} className = "active-button" text={"View Calendar"} onClick={() => navigate("/mycalendar")}/>
                    <LogoutButton textContent={"Logout"} onClick={logout}/>
                </div>

            </div>
        )
    }
} 


export default HomePage