import React, { useState } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { ImageDisplay } from '../forms'

function ImageGrid(props) {
    const flashImages = props.tattooInfo.flashImages
    const [selected, setSelected] = useState([])
    const [currentImages, setCurrentImages] = useState(flashImages.slice(0, 9))
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(flashImages.length / 9) // Calculate total pages

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
            const nextPageImages = flashImages.slice(currentPage * 9, (currentPage + 1) * 9)
            setCurrentImages(nextPageImages)
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const prevPageImages = flashImages.slice((currentPage - 2) * 9, (currentPage - 1) * 9)
            setCurrentPage(currentPage - 1)
            setCurrentImages(prevPageImages)
        }
    }

    const handleSelected = (imageObject) => {
        let select = selected
        if (selected.includes(imageObject)) {
            setSelected(selected.filter((item) => item !== imageObject))
            select = selected.filter((item) => item !== imageObject)
        } else {
            setSelected([...selected, imageObject])
            select = [...selected, imageObject]
        }
        const newTattooInfo = {
            ...props.tattooInfo,
            selectedFlash: select,
        }
        props.callBack(newTattooInfo, 'selected', props.field) // Pass the selected images to the callback function
    }

    return (
        <>  
            <div className="image-grid">
                {currentImages.map((imageObject, index) => (
                    <div
                        key={index}
                        className={selected.includes(imageObject) ? "image-grid-item-selected" : "image-grid-item"}
                        onClick={() => handleSelected(imageObject)} // Pass a function to setSelected
                    >
                        <ImageDisplay s3key={imageObject.key} />
                    </div>
                ))}
            </div>

            <div className="gridpage">
                <div onClick={handlePreviousPage} className="p">
                    <FaArrowLeft />
                    <p>Previous Page</p>
                </div>
                <div onClick={handleNextPage} className="p">
                    <p>Next Page</p>
                    <FaArrowRight />
                </div>
            </div>
        </>
    )
}

export default ImageGrid
