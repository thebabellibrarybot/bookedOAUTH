import { putBookingProfile } from "services/http/open"
import { BasicButton } from "components/buttons"
import { useBookingFormInfoContext } from "../provider/bookingFormInfo"
import { SizeTextBox } from "../components/buttons"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ImageUploadForm, ImageDisplay } from "../components/forms"
import { MdLocationPin } from "react-icons/md"

const EditProfile = ({handleLogout}) => {

    const { bookingFormInfo, setBookingFormInfo } = useBookingFormInfoContext()
    const [ profileImage, setProfileImage ] = useState(null)
    const [ backgroundImage, setBackgroundImage ] = useState(null)
    const [ nameImage, setNameImage ] = useState(null)
    const [ formView, setFormView ] = useState(false)
    const navigate = useNavigate()

    console.log(bookingFormInfo, "bookingFormInfo")

    const handleSubmit = () => {
        const combinedBookingFormInfo = {...bookingFormInfo, adminInfo: {
            bio: bookingFormInfo.adminInfo.bio,
            displayName: bookingFormInfo.adminInfo.displayName,
            location: bookingFormInfo.adminInfo.location,
            locationDates: bookingFormInfo.adminInfo.locationDates,
            profileImage: profileImage?bookingFormInfo.adminInfo.profileImage:bookingFormInfo.adminInfo.profileImage,
            backgroundImage: backgroundImage?bookingFormInfo.adminInfo.backgroundImage:bookingFormInfo.adminInfo.backgroundImage,
            nameImage: nameImage?bookingFormInfo.adminInfo.nameImage:bookingFormInfo.adminInfo.nameImage,
        }}
        console.log('setting:', combinedBookingFormInfo, 'to bookingFormInfo')

        putBookingProfile(combinedBookingFormInfo)
            .then(response => {
                navigate("/home")
            })
            .catch(error => {
                console.error(error)
            })
    }

    const handleMessage = (message) => {
        setBookingFormInfo({...bookingFormInfo, adminInfo: {...bookingFormInfo.adminInfo, bio: message}})
    }
    const handleProfileImageUpload = (e) => {
        setBookingFormInfo({...bookingFormInfo, adminInfo: {...bookingFormInfo.adminInfo, profileImage: e[0].key}})
        setProfileImage(e[0].key)
    }
    const handleBackgroundImageUpload = (e) => {
        setBackgroundImage(e[0].key)
        setBookingFormInfo({...bookingFormInfo, adminInfo: {...bookingFormInfo.adminInfo, backgroundImage: e[0].key}})
    }
    const handleNameImageUpload = (e) => {
        setNameImage(e[0].key)
        setBookingFormInfo({...bookingFormInfo, adminInfo: {...bookingFormInfo.adminInfo, nameImage: e[0].key}})
    }
    const logout = () => {
        handleLogout()
        localStorage.removeItem("sid")
        navigate("/")
    }

    let sid = localStorage.getItem("sid")
    if (sid === null) {
        logout()
        navigate("/")
    }
    
    if (bookingFormInfo !== null) {
        const headerStyle = {
            backgroundImage: `url(${bookingFormInfo.adminInfo.backgroundImage})`,
            backgroundSize: '100% auto',
            backgroundPosition: 'center',
        }
        console.log(bookingFormInfo, "bookingFormInfo.adminInfo.nameImage")
        return (
            <div className="content">

                <div className="form-banner" style = {headerStyle}>
                    {bookingFormInfo.adminInfo.nameImage ? <ImageDisplay s3key = {bookingFormInfo.adminInfo.nameImage}></ImageDisplay> : <h1>{bookingFormInfo.adminInfo.displayName}</h1>}
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

                <div className="form-header" style = {{flexDirection: "column", textAlign: "left"}}>
                    <h3 style={{width: "100%", textAlign: "left"}}>Edit Profile</h3>
                    <div className="form-grid">
                        <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Display Name</p>
                        <input
                            type="text"
                            name="name"
                            value={bookingFormInfo.adminInfo.displayName}
                            onChange = {(e) => setBookingFormInfo({...bookingFormInfo, adminInfo: {...bookingFormInfo.adminInfo, displayName: e.target.value}})}
                        />
                        <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Bio</p>
                        <SizeTextBox value = {bookingFormInfo.adminInfo.bio} callbackFunction = {handleMessage}/>
                        <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Location</p>
                        <input
                            type="text"
                            name="location"
                            value={bookingFormInfo.adminInfo.location}
                            onChange = {(e) => setBookingFormInfo({...bookingFormInfo, adminInfo: {...bookingFormInfo.adminInfo, location: e.target.value}})}
                        />
                    </div>
                    <p style={{width: "100%", textAlign: "left"}}>Edit Profile Image</p>
                    <ImageUploadForm callBackFunction = {handleProfileImageUpload} maxImages={1} type = "profileImage"/>
                    <p style={{width: "100%", textAlign: "left"}}>Edit Background Image</p>
                    <ImageUploadForm callBackFunction = {handleBackgroundImageUpload} maxImages={1} type = "backgroundImage"/>
                    <p style={{width: "100%", textAlign: "left"}}>Edit Name Image</p>
                    <ImageUploadForm callBackFunction = {handleNameImageUpload} maxImages={1} type = "nameImage"/>
                </div>
                <div className="form-header">
                    <BasicButton style = {{backgroundColor: "rgba(255, 255, 255, 0.166)", padding: "0", margin: "0"}} className = "active-button" text = {"Save"} onClick = {handleSubmit}/>
                    <p style = {{padding: "5px"}}></p>
                    {formView ? <BasicButton style={{backgroundColor: "rgba(255, 255, 255, 0.166)", padding: "0", margin: "0"}} className="active-button" text = {"Edit Form"} onClick = {() => setFormView(false)}/> : <BasicButton style = {{backgroundColor: "rgba(255, 255, 255, 0.166)", padding: "0", margin: "0"}} className = "active-button" text = {"View Form"} onClick = {() => setFormView(true)}/>}                
                </div>
            </div>
        )
    }
}
export default EditProfile