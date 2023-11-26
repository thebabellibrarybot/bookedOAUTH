import React, { useState } from 'react'
import { arrayToText } from 'services/utils'

const BookingRulesForm = ({ tattooInfo, callBackFunction }) => {

    console.log(tattooInfo, "tattooInfo from bookingRulesForm")
    const { customOptions, flashImages, hourlyPrice, depositAmout, venmo, deposits, availableColors, small, medium, large, availableTimes } = tattooInfo
    const [state, setState] = useState({
        flashImages,
        hourlyPrice,
        depositAmout,
        venmo,
        deposits,
        availableColors,
        small,
        medium,
        large,
        availableTimes,
    })
    const [isValueChanged, setIsValueChanged] = useState(
        {
            flashImages: false,
            hourlyPrice: false,
            depositAmout: false,
            venmo: false,
            deposits: false,
            availableColors: false,
            small: false,
            medium: false,
            large: false,
            availableTimes: false,
        }
    )
    const handleInputChange = (e, fieldName) => {
        setState({
            ...state,
            [fieldName]: e.target.value,
        })  
        setIsValueChanged({
            ...isValueChanged,
            [fieldName]: true,
        })
        callBackFunction({
            ...state,
            [fieldName]: e.target.value,
        }, fieldName, 'tattooInfo')
    }

    return (
        <div>
            <div className="form-grid">
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Hourly Price Range</p>
                <input
                    type="text"
                    name="name"
                    value={isValueChanged.hourlyPrice ? arrayToText(state.hourlyPrice) : ''}
                    placeholder='i.e. "$100 - $200"'
                    onChange = {(e)=>handleInputChange((e), 'hourlyPrice')}
                />
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Deposit Amount</p>
                <input
                    type="text"
                    name="location"
                    value={isValueChanged.depositAmout ? state.depositAmout : ''}
                    placeholder='i.e. $50'
                    onChange = {(e)=>handleInputChange(e, 'depositAmout')}
                />
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Venmo Username</p>
                <input
                    type="text"
                    name="name"
                    value={isValueChanged.venmo ? state.venmo : ''}
                    placeholder='i.e. "@username"'
                    onChange = {(e)=>handleInputChange(e, 'venmo')}
                />
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Deposit Message</p>
                <input
                    type="text"
                    name="location"
                    value={isValueChanged.deposits ? state.deposits : ''}
                    placeholder='i.e. "Deposit is required to book an appointment."'
                    onChange = {(e)=>handleInputChange(e, 'deposits')}
                />
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Available Colors</p>
                <input  
                    type="text"
                    name="name"
                    value={isValueChanged.availableColors ? arrayToText(state.availableColors) : ''}
                    placeholder='i.e. "black, red, blue"'
                    onChange = {(e)=>handleInputChange(e, 'availableColors')}
                />
                {state.small ? 
                    <>
                        <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Small Tattoo Size</p>
                        <input
                            type="text"
                            name="location"
                            value={isValueChanged.small ? state.small : ''}
                            placeholder='i.e. 3" x 3"'
                            onChange = {(e)=>handleInputChange(e, 'small')}
                        />
                        <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Medium Tattoo Size</p>
                        <input
                            type="text"
                            name="location"
                            value={isValueChanged.medium ? state.medium : ''}
                            placeholder='i.e. 6" x 6"'
                            onChange = {(e)=>handleInputChange(e, 'medium')}
                        />
                        <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Large Tattoo Size</p>
                        <input
                            type="text"
                            name="location"
                            value={isValueChanged.large ? state.large : ''}
                            placeholder='i.e. 12" x 12"'
                            onChange = {(e)=>handleInputChange(e, 'large')}
                        />
                    </> 
                    : null}

            </div>
        </div>
    )
}

export default BookingRulesForm

