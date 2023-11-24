import React, { useEffect, useState } from 'react'
import { LogoutButton, BasicButton } from 'components/buttons'
import { usersController, openController } from 'services/http'
import { useNavigate } from 'react-router-dom'
import { useBookingFormInfoContext } from 'provider/bookingFormInfo'
import { MdLocationPin } from 'react-icons/md'

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
                <img src = {bookingFormInfo.adminInfo?bookingFormInfo.adminInfo.image?bookingFormInfo.adminInfo.image:user.picture:user.picture} alt = 'basic profile image'></img>
                
                <div className='form-bio'>
                    <h3>{user.fullname.length > 1 ? user.fullname : bookingFormInfo.adminInfo?bookingFormInfo.adminInfo.displayName:user.fullname}</h3>
                </div>
            </div>

            <div className="form-header">                
                <div className='form-bio'>
                    <div style = {{display: 'flex', textAlign: 'left'}}>
                        <MdLocationPin className='icon-sm'/>
                        <p>{`Public Link:\n https://localhost:3000/${user.id}`}</p>
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
            bio: "Default Bio",
            profileImage: "654827adc537c9ee74365b2f/profileImage/1700853575168-unnamed.jpg",
            backgroundImage: "654827adc537c9ee74365b2f/profileImage/1700853575168-unnamed.jpg",
            nameImage: "654827adc537c9ee74365b2f/profileImage/1700853575168-unnamed.jpg",
            location: "Default Location",
        },
        tattooInfo: {
            customOptions: [],
            flashImages: [],
            hourlyPrice: 0,
            availableColors: [],
            small: 0,
            medium: 0,
            large: 0,
            availableTimes: [],
        },
        themesInfo: {
            themes: [],
        },
        calendarInfo: {
            blockedWeekDates: [],
            availableTimes: [],
            currentlyBooked: [],
            blockTime: 0,
            bookedMin: 0,
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
                            hourlyPrice: 0,
                            availableColors: [],
                            small: 0,
                            medium: 0,
                            large: 0,
                            availableTimes: [],
                        },
                        adminInfo: {
                            displayName: "Default Name",
                            bio: "Default Bio",
                            profileImage: "654827adc537c9ee74365b2f/profileImage/1700853575168-unnamed.jpg",
                            backgroundImage: "654827adc537c9ee74365b2f/profileImage/1700853575168-unnamed.jpg",
                            nameImage: "654827adc537c9ee74365b2f/profileImage/1700853575168-unnamed.jpg",
                            location: "Default Location",
                        },
                        themesInfo: {
                            themes: [],
                        },
                        calendarInfo: {
                            blockedWeekDates: [],
                            availableTimes: [],
                            currentlyBooked: [],
                            blockTime: 0,
                            bookedMin: 0,
                        }
                    }
                    alert("Hello New User! Please create a booking form")
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

    if (userInformation === null){
        return <Spinner />
    }
    if  (bookingFormInfo === null) {
        return <Spinner />
    }
    return (
        <div className='content'>

            {bookingFormInfo ? <UserInformation user={userInformation} bookingFormInfo={bookingFormInfo}/> : <UserInformation user={userInformation} bookingFormInfo={defaultBookingFormInfo}/>}

            <div className='form-line'>
                <BasicButton style = {{backgroundColor: "rgba(255, 255, 255, 0.166)"}} className = "active-button" text = {"Edit Profile"} onClick={() => navigate(`/editprofile`)}/>

                {bookingFormInfo ? <BasicButton style = {{backgroundColor: "rgba(255, 255, 255, 0.166)"}} className = "active-button" text={"Edit Booking Form"} onClick={() => navigate("/editbookingform")}/> : <BasicButton style = {{backgroundColor: "rgba(255, 255, 255, 0.166)"}} className = "active-button" text={"Create a Booking Form"} onClick={() => navigate("/editbookingform")}/>}

                <BasicButton style = {{backgroundColor: "rgba(255, 255, 255, 0.166)"}} className = "active-button" text={"View Calendar"} onClick={() => navigate("/mycalendar")}/>

                <LogoutButton textContent={"Logout"} onClick={logout}/>
            </div>

        </div>
    )
} 


export default HomePage