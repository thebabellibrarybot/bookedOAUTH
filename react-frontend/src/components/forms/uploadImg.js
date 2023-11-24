import React, { useRef, useState } from 'react'
import { putBookingProfileImages } from '../../services/http/open'
import { useBookingFormInfoContext } from 'provider/bookingFormInfo'

const ImageUploadForm = ({ callBackFunction, type, maxImages }) => {
    const fileInputRef = useRef(null)
    const [message, setMessage] = useState('') // Initialize the message state variable
    const { bookingFormInfo } = useBookingFormInfoContext()

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

        putBookingProfileImages(formData, id, type)
            .then(response => {
                console.log(response, "response from putBookingProfileImages")
                callBackFunction(response.data)
            })
            .catch(error => {
                console.error(error, "error from putBookingProfileImages")
            })
        
        setMessage(`${files.length} images uploaded ${files.name}`)
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

export default ImageUploadForm
