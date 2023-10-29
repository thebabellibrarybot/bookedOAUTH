import React, { useEffect, useState } from 'react'

function ImageGrid(props) {

    const flashImages = props.flashImages
    const customOptions = props.customOptions

    console.log(flashImages, 'flashImages from imageGrid.js', props)

    // State to track the currently displayed images and the selected image
    const [currentImages, setCurrentImages] = useState(flashImages.slice(0, 8))
    const [currentPage, setCurrentPage] = useState(1)
    const [selected, setSelected] = useState(null)

    useEffect(() => {

    }, [flashImages,currentPage])


    const handleNextPage = () => {
        const start = (currentPage - 1) * 8
        const end = Math.min(currentPage * 8, flashImages.length)
        setCurrentImages(flashImages.slice(start, end))
        setCurrentPage(currentPage + 1)
        setSelected(null) // Clear the selected image when moving to the next page
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            if (flashImages.length/8 > currentPage) {

                const start = (currentPage - 2) * 8
                const end = (currentPage - 1) * 8
                setCurrentImages(flashImages.slice(start, end))
                setCurrentPage(currentPage - 1)
                setSelected(null) // Clear the selected image when moving to the previous page
            }
        }
    }

    return (
        <>
            <div className="image-grid">
                <div className='image-grid-item'>
                    <p>Flash Selection</p>
                </div>
                {currentImages.map((imageObject, index) => (
                    <div
                        key={index}
                        className={index === selected ? "image-grid-item-selected" : "image-grid-item"}
                        onClick={() => setSelected(index)} // Pass a function to setSelected
                    >
                        <img src={imageObject.ImageURL} alt={imageObject} />
                        <p>{imageObject.imageName ? imageObject.imageName : null}</p>
                        <p>{imageObject.imageInfo ? imageObject.imageInfo : null}</p>
                    </div>
                ))}
            </div>

            <div>
                <div className="image-grid-item">
                    <button onClick={handlePreviousPage}>Previous Page</button>
                </div>
                
                <div className="image-grid-item">
                    <button onClick={handleNextPage}>Next Page</button>
                </div>
            </div>
        </>
    )
}

export default ImageGrid