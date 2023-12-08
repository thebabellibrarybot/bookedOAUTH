import ImageDisplay from "./displayS3Image"
import { MdLocationPin } from "react-icons/md"
import { copyTextById } from "services/utils"   

const ProfileUserInfo = ({ bookingFormInfo}) => {
        
    return (
        <div className="content">

            <div className="form-header">

                <ImageDisplay s3key = {bookingFormInfo.adminInfo.profileImage}></ImageDisplay>
                
                <div className='form-bio'>
                    <h3>{bookingFormInfo.adminInfo?bookingFormInfo.adminInfo.displayName:null}</h3>
                    <p>{bookingFormInfo.adminInfo.email}</p>
                    <div style = {{display: 'flex'}}>
                        <MdLocationPin className='icon-sm'/>
                        <p>{bookingFormInfo.adminInfo.location}: {bookingFormInfo.adminInfo.locationDates}</p>
                    </div>
                </div>

            </div>

        </div>
    )
}
const FormUserInfo = ({user, bookingFormInfo, headerStyle}) => {

    return (
        <div className="content">

            <div className="form-banner nameImage" style = {headerStyle}>
                {bookingFormInfo.adminInfo.nameImage ? <ImageDisplay s3key = {bookingFormInfo.adminInfo.nameImage}></ImageDisplay> : <h1>cant show image</h1>}
            </div>

            <ProfileUserInfo user = {user} bookingFormInfo = {bookingFormInfo}></ProfileUserInfo>

            <div className='form-header'>
                <p>{bookingFormInfo.adminInfo.bio}</p>
            </div>

        </div>
    )
}
const HomeUserInfo = ({user, bookingFormInfo}) => {
    
    return (
        <div className='content'>
            
            <ProfileUserInfo user = {user} bookingFormInfo = {bookingFormInfo}></ProfileUserInfo>

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

export {ProfileUserInfo, FormUserInfo, HomeUserInfo}