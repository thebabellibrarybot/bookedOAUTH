import { BasicButton, RadioButtons, SizeTextBox } from "components/buttons"
import { useBookingFormInfoContext } from "provider/bookingFormInfo"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { MdLocationPin } from "react-icons/md"
import { CalendarForm, BookingRulesForm, ImageFlashUploadForm, ImageGrid, ImageDisplay, Calendar } from "components/forms"
import { FaPlus, FaMinus } from "react-icons/fa"
import { copyTextById } from "services/utils"
import { putBookingProfile } from "services/http/open"
import { openController } from "services/http"


const EditForm = () => {

    const [state, setState] = useState({
        flashImages: false,
        calendarRules: false,
        bookingRules: false,
    })
    const { getBookingInfo, setBookingFormInfo } = useBookingFormInfoContext()
    const bookingFormInfo = getBookingInfo()
    
    const handleClick = (fieldName) => {
        setState({
            ...state,
            [fieldName]: !state[fieldName],
        })
    }
    const handleCallBack = (e, fieldName, field) => {
        console.log(`${field} set to: `, e)
        setBookingFormInfo({
            ...bookingFormInfo,
            [field]: e,
        })
    }
    
    const handleFlashCallBack = (e) => {
        setBookingFormInfo({
            ...bookingFormInfo,
            tattooInfo: {
                ...bookingFormInfo.tattooInfo,
                uploadedFlash: e,
            }
        })
    }
    return (
        <div className="content">

            <div className="form-line">
                <div style = {{width: "100%", display: 'flex', textAlign: 'left', alignItems: "left"}} onClick={()=>handleClick('flashImages')}>
                    <h3 style = {{width: "100%", textAlign: "left"}}>Set Flash Rules</h3>
                    {state.flashImages ?<FaMinus/> : <FaPlus/>}
                </div>
                {state.flashImages ? 
                    <>
                        <p>Upload new flash</p>
                        <ImageFlashUploadForm callBackFunction={handleFlashCallBack} type = 'flashImages' maxImages={10} uploadType='editflashimage'/>
                        <br></br>
                        <p>Delete Flash</p>
                        <ImageGrid tattooInfo={bookingFormInfo.tattooInfo} callBack = {handleCallBack} field = 'tattooInfo'/>
                    </> : null}
            </div>

            <div className="form-line">
                <div style = {{width: "100%", display: 'flex', textAlign: 'left', alignItems: "left"}}  onClick={()=>handleClick('calendarRules')}>
                    <h3 style = {{width: "100%", textAlign: "left"}}>Set Calendar Rules</h3>
                    {state.calendarRules ?<FaMinus/> : <FaPlus/>}
                </div>
                {state.calendarRules ? <CalendarForm calendarInfo={bookingFormInfo.calendarInfo} callBackFunction={handleCallBack}/> : null}
            </div>

            <div className="form-line">
                <div style = {{width: "100%", display: 'flex', textAlign: 'left', alignItems: "left"}} onClick={()=>handleClick('bookingRules')}>
                    <h3 style = {{width: "100%", textAlign: "left"}}>Set Booking Rules</h3>
                    {state.bookingRules ?<FaMinus/> : <FaPlus/>}
                </div>
                {state.bookingRules ? <BookingRulesForm tattooInfo={bookingFormInfo.tattooInfo} callBackFunction={handleCallBack}/> : null}
            </div>
            {/*<div className="form-line">
                <h3>Set Payment Rules</h3>
            </div>
            <div className="form-line">
                <h3>Set Email Rules</h3>
            </div>*/}
        </div>
    )
}

const ViewForm = ({bookingFormInfo}) => {

    const [imageSrc, setImageSrc] = useState('')

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
    

    const headerStyle = {
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: '100% auto',
        backgroundPosition: 'center',
    }

    return (
        <div className='form-line' style = {{justifyContent: "center", alignItems: "center", width: "100%"}}>

            <div className="form-banner nameImage" style = {headerStyle}>
                {bookingFormInfo.adminInfo.nameImage ? <ImageDisplay s3key = {bookingFormInfo.adminInfo.nameImage}></ImageDisplay> : null}
            </div>

            <div className="form-header">
                <ImageDisplay s3key = {bookingFormInfo.adminInfo.profileImage}></ImageDisplay> 
                <div className='form-bio'>
                    <h3>{bookingFormInfo.adminInfo.displayName}</h3>
                    <p>{bookingFormInfo.adminInfo.email}</p>
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
                    value={ '' }
                />
                <p>Last Name</p>
                <input
                    type="text"
                    name="lastName"
                    value={ '' }
                />
                <p>Email</p>
                <input
                    type="email"
                    name="email"
                    value={ '' }
                />
                <p>Phone Number</p>
                <input
                    type="tel"
                    name="phone"
                    value={ '' }
                />
            </div>

            <div className="form-line">

                <h3 style = {{textAlign: "left"}}>{"What would you like to get tattooed?"}</h3>
                <p>Upload Custom Image</p>
                <ImageFlashUploadForm maxImages={0} callBackFunction = {null} type = 'customFlash' uploadType='sendflashtoschedule'/>
                
                <br></br>
                
                {bookingFormInfo.tattooInfo.flashImages.length > 1 ? 
                    <>
                        <p>Select From Flash</p>
                        <ImageGrid tattooInfo = {bookingFormInfo.tattooInfo} callBack = {null} field = 'tattooInfo'/>
                    </> : null}

                <br></br>

                <RadioButtons arr = {[bookingFormInfo.tattooInfo.small, bookingFormInfo.tattooInfo.medium, bookingFormInfo.tattooInfo.large]} header = 'Flash Size Options' callBack = {null}/>

                <br></br>

                <h3 style = {{textAlign: "left"}}>{"Any additional details?"}</h3>
                <SizeTextBox value = {''} callbackFunction = {null}/>

            </div>

            <div className='form-line'>
                <Calendar bookingFormInfo={bookingFormInfo} callBackTrigger={null}/>
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
                <BasicButton text = {"Submit button"} onClick={null} className={'active-button'} style = {{backgroundColor: "rgba(255, 255, 255, 0.166)"}}/>

            </div>
        </div>
    )
}

const EditBookingForm = ({handleLogout}) => {

    const navigate = useNavigate()
    const { getBookingInfo } = useBookingFormInfoContext()
    const bookingFormInfo = getBookingInfo()
    const [ viewForm, setViewForm ] = useState(false)

    function removeSelectedItems(flashImages, selectedItems) {
        if (!selectedItems) {
            return flashImages
        }
        return flashImages.filter((image) => !selectedItems.includes(image))
    }
    function addSelectedItems(flashImages, selectedItems) {
        return flashImages.concat(selectedItems)
    }
      
    const handleSubmit = (e) => {
        e.preventDefault()

        const sid = localStorage.getItem("sid")
        const newFlashImages = bookingFormInfo.tattooInfo.uploadedFlash ? addSelectedItems(bookingFormInfo.tattooInfo.flashImages, bookingFormInfo.tattooInfo.uploadedFlash) : bookingFormInfo.tattooInfo.flashImages
        const newSelectedFlash = removeSelectedItems(newFlashImages, bookingFormInfo.tattooInfo.selectedFlash)
        const newTattooInfo = {
            ...bookingFormInfo.tattooInfo,
            flashImages: newSelectedFlash,
        }
        const newBookingFormInfo = {
            ...bookingFormInfo,
            tattooInfo: newTattooInfo,
            adminInfo: {
                ...bookingFormInfo.adminInfo,
                email: bookingFormInfo.adminInfo.email?bookingFormInfo.adminInfo.email:sid.email,
            }
        }

        putBookingProfile(newBookingFormInfo)
            .then((res) => {
                console.log(res, "res from editBookingForm")
                if (res.status === 200) {
                    navigate("/home")
                }
            })
            .catch((err) => {
                console.log(err, "err from editBookingForm")
            })
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
        return (
            <div className="content">
                <div className = "form-line">
                    <h3>Edit Booking Form</h3>
                    <div className='form-bio' style = {{ width: "100%", borderRadius: "10px"}}>
                        <p style = {{width: "100%", textAlign: "left"}}>Public Link:</p>
                        <div style = {{display: 'flex', textAlign: 'left'}} onClick={()=>copyTextById('publink')}>
                            <MdLocationPin className='icon-sm'/>
                            <p id='publink' className="size-text-box" style={{textAlign: "left"}}>{`http://localhost:3000/bookingform/${bookingFormInfo.adminId}`}</p>
                        </div>
                    </div>              
                </div>
                {viewForm ? <ViewForm bookingFormInfo = {bookingFormInfo}/> : <EditForm/>}
                <div className="form-header">
                    <BasicButton style = {{backgroundColor: "rgba(255, 255, 255, 0.166)", padding: "0", margin: "0"}} className = "active-button" text = {"Save"} onClick = {handleSubmit}/>
                    <p style = {{padding: "5px"}}></p>
                    {viewForm ? <BasicButton style={{backgroundColor: "rgba(255, 255, 255, 0.166)", padding: "0", margin: "0"}} className="active-button" text = {"Edit Form"} onClick = {() => setViewForm(false)}/> : <BasicButton style = {{backgroundColor: "rgba(255, 255, 255, 0.166)", padding: "0", margin: "0"}} className = "active-button" text = {"View Form"} onClick = {() => setViewForm(true)}/>}                
                </div>  
            </div>
        )
    }
}
export default EditBookingForm