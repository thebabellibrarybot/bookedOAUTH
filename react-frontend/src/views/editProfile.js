import { putBookingProfile } from "services/http/open"
import { BasicButton } from "components/buttons"
import { useBookingFormInfoContext } from "../provider/bookingFormInfo"
import { SizeTextBox } from "../components/buttons"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ImageUploadForm, FormUserInfo } from "../components/forms"
import { useEffect } from "react"
import { openController } from "services/http"

const EditProfile = ({handleLogout}) => {

    const { getBookingInfo, setBookingFormInfo } = useBookingFormInfoContext()
    const bookingFormInfo = getBookingInfo()
    const [ profileImage, setProfileImage ] = useState(null)
    const [ backgroundImage, setBackgroundImage ] = useState(null)
    const [ nameImage, setNameImage ] = useState(null)
    const user = localStorage.getItem("sid")
    const navigate = useNavigate()
    const [isValueChanged, setIsValueChanged] = useState({
        displayName: false,
        bio: false,
        location: false,
        email: false,
    })

    console.log(bookingFormInfo, "bookingFormInfo from editProfile")

    const handleInputChange = (e, fieldName) => {
        setBookingFormInfo({
            ...bookingFormInfo,
            adminInfo: { ...bookingFormInfo.adminInfo, [fieldName]: e.target.value },
        })  
        setIsValueChanged({
            ...isValueChanged,
            [fieldName]: true,
        })
    }

    const handleSubmit = () => {
        const combinedBookingFormInfo = {...bookingFormInfo, adminInfo: {
            bio: bookingFormInfo.adminInfo.bio,
            displayName: bookingFormInfo.adminInfo.displayName,
            location: bookingFormInfo.adminInfo.location,
            email: bookingFormInfo.adminInfo.email,
            locationDates: bookingFormInfo.adminInfo.locationDates,
            profileImage: profileImage?bookingFormInfo.adminInfo.profileImage:bookingFormInfo.adminInfo.profileImage,
            backgroundImage: backgroundImage?bookingFormInfo.adminInfo.backgroundImage:bookingFormInfo.adminInfo.backgroundImage,
            nameImage: nameImage?bookingFormInfo.adminInfo.nameImage:bookingFormInfo.adminInfo.nameImage,
        }}

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
    
    const [imageSrc, setImageSrc] = useState('')

    useEffect(() => {
        // Fetch or generate the pre-signed URL here
        const fetchImageURL = async () => {
            try {
                // Replace 'YOUR_SERVER_ENDPOINT' with the endpoint that generates the pre-signed URL
                const response = await openController.getS3Image(bookingFormInfo.adminInfo.backgroundImage)
                setImageSrc(response.data)
            } catch (error) {
                console.error('Error fetching image URL:', error)
            }
        }

        fetchImageURL()
    }, [bookingFormInfo.adminInfo.backgroundImage])
    
    if (imageSrc !== '') {
        const headerStyle = {
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: '100% auto',
            backgroundPosition: 'center',
        }
        return (
            <div className="content">

                <FormUserInfo user = {user} bookingFormInfo = {bookingFormInfo} headerStyle = {headerStyle}></FormUserInfo>

                <br></br>

                <div className="form-header" style = {{flexDirection: "column", textAlign: "left"}}>
                    <h3 style={{width: "100%", textAlign: "left"}}>Edit Profile</h3>
                    <div className="form-grid">
                        <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Display Name</p>
                        <input
                            type="text"
                            name="name"
                            value={isValueChanged.displayName ? bookingFormInfo.adminInfo.displayName : ''}
                            placeholder={bookingFormInfo.adminInfo.displayName}
                            onChange = {(e)=>handleInputChange(e, 'displayName')}
                        />
                        <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Bio</p>
                        <SizeTextBox value = {bookingFormInfo.adminInfo.bio} callbackFunction = {handleMessage}/>
                        <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Location</p>
                        <input
                            type="text"
                            name="location"
                            value={isValueChanged.location ? bookingFormInfo.adminInfo.location : ''}
                            placeholder={bookingFormInfo.adminInfo.location}
                            onChange = {(e)=>handleInputChange(e, 'location')}
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
                </div>
            </div>
        )
    }
}
export default EditProfile