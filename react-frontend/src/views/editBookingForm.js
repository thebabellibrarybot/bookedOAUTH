import { BasicButton } from "components/buttons"
import { useBookingFormInfoContext } from "provider/bookingFormInfo"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { MdLocationPin } from "react-icons/md"
import { BookingFormInfo } from "../views"

const EditForm = () => {
    return (
        <div className="content">
            <div className="form-line">
                <h3>Add Flash Images</h3>
            </div>
            <div className="form-line">
                <h3>Set Calendar Rules</h3>
            </div>
            <div className="form-line">
                <h3>Set Booking Rules</h3>
            </div>
            <div className="form-line">
                <h3>Set Payment Rules</h3>
            </div>
            <div className="form-line">
                <h3>Set Email Rules</h3>
            </div>
        </div>
    )
}
const EditBookingForm = ({handleLogout}) => {

    const navigate = useNavigate()
    const { bookingFormInfo, setBookingFormInfo } = useBookingFormInfoContext(null)
    const [ viewForm, setViewForm ] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("submitting")
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
                <h3>Edit Booking Form</h3>
                <div className = "form-line">
                    <div className='form-bio'>
                        <div style = {{display: 'flex', textAlign: 'left'}}>
                            <MdLocationPin className='icon-sm'/>
                            <p>{`Public Link:\n https://localhost:3000/${bookingFormInfo.adminId}`}</p>
                        </div>
                    </div>
                    {viewForm ? <BasicButton style = {{backgroundColor: "rgba(255, 255, 255, 0.166)"}} text="edit form" onClick={()=>setViewForm(false)}/> : <BasicButton style = {{backgroundColor: "rgba(255, 255, 255, 0.166)"}} text="view form" onClick={()=>setViewForm(true)}/>}
                </div>
                {viewForm ? <p>view the form</p> : <EditForm/>}
            </div>
        )
    }
}
export default EditBookingForm