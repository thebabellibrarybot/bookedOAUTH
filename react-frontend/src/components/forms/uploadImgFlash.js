import React, { useRef, useState } from 'react'
import { putBookingFlashImages, postScheduleFlashImages } from '../../services/http/open'
import { useBookingFormInfoContext } from 'provider/bookingFormInfo'

const ImageFlashUploadForm = ({ callBackFunction, type, maxImages, uploadType }) => {
    const fileInputRef = useRef(null)
    const [message, setMessage] = useState('') // Initialize the message state variable
    const { getBookingInfo } = useBookingFormInfoContext()
    const bookingFormInfo = getBookingInfo()

    const uploadImages = () => {

        const input = fileInputRef.current
        const files = input.files
        const formData = new FormData()
        const id = bookingFormInfo.adminId


        if (files.length > maxImages) {
            setMessage(`Only ${maxImages} images allowed`)
            return
        }
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            if (file.type.startsWith("image/")) {
                formData.append('file', file) 
            } else {
                setMessage(`Invalid file type. Only ${type} files are allowed.`)
                return
            }
        }
        // a req to /adminflashimages/:id/:type that will update the admins available flash
        if (uploadType === 'editflashimage') {
            putBookingFlashImages(formData, id, type)
                .then(response => {
                    console.log(response, "response from putBookingFlashImages")
                    callBackFunction(response.data)
                })
                .catch(error => {
                    console.error(error, "error from putBookingFlashImages")
                })
            
            setMessage(`${files.length} images uploaded ${files.name}`)
            input.value = null // Reset the input so that the same file can be uploaded again
        }
        // a req to /bookingformimages that will update custom flash option
        if (uploadType === 'sendflashtoschedule') {
            postScheduleFlashImages(formData, id, type)
                .then(response => {
                    console.log(response, "response from putScheduleFlashImages")
                    callBackFunction(response.data)
                })
                .catch(error => {
                    console.error(error, "error from putScheduleFlashImages")
                })
            
            setMessage(`${files.length} images uploaded ${files.name}`)
            input.value = null // Reset the input so that the same file can be uploaded again
        }
    }


    return (
        <div>
            <input
                type="file"
                accept="image/*"
                id='file'
                name = 'file' // Set the ID based on the 'type' prop
                ref={fileInputRef}
                multiple
                onChange={uploadImages}
            />
            <p>{message}</p>
        </div>
    )
}

export default ImageFlashUploadForm