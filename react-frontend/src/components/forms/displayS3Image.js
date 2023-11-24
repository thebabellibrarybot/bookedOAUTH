import React, { useState, useEffect } from 'react'
import { openController } from 'services/http'

const ImageDisplay = ({s3key}) => {
    const [imageSrc, setImageSrc] = useState('')

    useEffect(() => {
        // Fetch or generate the pre-signed URL here
        const fetchImageURL = async () => {
            try {
                // Replace 'YOUR_SERVER_ENDPOINT' with the endpoint that generates the pre-signed URL
                const response = await openController.getS3Image(s3key)
                setImageSrc(response.data)
            } catch (error) {
                console.error('Error fetching image URL:', error)
            }
        }

        fetchImageURL()
    }, [s3key]) // Run this effect only once on component mount

    return (
        <div>
            <img src={imageSrc} alt="S3 Image" />
        </div>
    )
}

export default ImageDisplay
