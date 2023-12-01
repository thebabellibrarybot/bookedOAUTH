import { BasicButton } from "components/buttons"
import { useBookingFormInfoContext } from "provider/bookingFormInfo"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { MdLocationPin } from "react-icons/md"
import { CalendarForm, BookingRulesForm, ImageFlashUploadForm, ImageGrid } from "components/forms"
import { FaPlus, FaMinus } from "react-icons/fa"
import { copyTextById } from "services/utils"
import { putBookingProfile } from "services/http/open"


const EditForm = () => {

    const [state, setState] = useState({
        flashImages: false,
        calendarRules: false,
        bookingRules: false,
    })
    const { bookingFormInfo, setBookingFormInfo } = useBookingFormInfoContext()

    const handleClick = (fieldName) => {
        setState({
            ...state,
            [fieldName]: !state[fieldName],
        })
    }
    const handleCallBack = (e, fieldName, field) => {
        setBookingFormInfo({
            ...bookingFormInfo,
            [field]: e,
        })
        console.log(`set ${field} to:`, e)
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



const EditBookingForm = ({handleLogout}) => {

    const navigate = useNavigate()
    const { bookingFormInfo } = useBookingFormInfoContext()
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

        const newFlashImages = bookingFormInfo.tattooInfo.uploadedFlash ? addSelectedItems(bookingFormInfo.tattooInfo.flashImages, bookingFormInfo.tattooInfo.uploadedFlash) : bookingFormInfo.tattooInfo.flashImages
        const newSelectedFlash = removeSelectedItems(newFlashImages, bookingFormInfo.tattooInfo.selectedFlash)
        const newTattooInfo = {
            ...bookingFormInfo.tattooInfo,
            flashImages: newSelectedFlash,
        }
        const newBookingFormInfo = {
            ...bookingFormInfo,
            tattooInfo: newTattooInfo,
        }

        console.log(newBookingFormInfo, "submit to newBookingFormInfo")

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

    console.log(bookingFormInfo, "bookingFormInfo")

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
                {viewForm ? <p>view the form</p> : <EditForm/>}
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