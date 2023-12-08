import React, { useState } from 'react'
import { arrayToText } from 'services/utils'
import { RadioButtons } from '../buttons'

const BookingRulesForm = ({ tattooInfo, callBackFunction }) => {

    const { flashImages, hourlyPrice, depositAmount, venmo, deposits, paymentType, paypal, cashapp } = tattooInfo
    const [state, setState] = useState({
        flashImages,
        hourlyPrice,
        depositAmount,
        venmo,
        deposits,
        paymentType,
        paypal,
        cashapp,
    })
    const [isValueChanged, setIsValueChanged] = useState(
        {
            flashImages: false,
            hourlyPrice: false,
            depositAmount: false,
            venmo: false,
            deposits: false,
            paymentType: false,
            paypal: false,
            cashapp: false,
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

    const handleSelectChange = (e, fieldName) => {
        setState({
            ...state,
            [fieldName]: e,
        })
        setIsValueChanged({
            ...isValueChanged,
            [fieldName]: true,
        })
        callBackFunction({
            ...state,
            [fieldName]: e,
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
                    value={isValueChanged.depositAmount ? state.depositAmount : ''}
                    placeholder='i.e. $50'
                    onChange = {(e)=>handleInputChange(e, 'depositAmount')}
                />
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Venmo Username</p>
                <input
                    type="text"
                    name="name"
                    value={isValueChanged.venmo ? state.venmo : ''}
                    placeholder='i.e. "@username"'
                    onChange = {(e)=>handleInputChange(e, 'venmo')}
                />
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Paypal Link</p>
                <input
                    type="text"
                    name="location"
                    value={isValueChanged.paypal ? state.paypal : ''}
                    placeholder='i.e. "paypal.me/username"'
                    onChange = {(e)=>handleInputChange(e, 'paypal')}
                />
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Cashapp Username</p>
                <input
                    type="text"
                    name="name"
                    value={isValueChanged.cashapp ? state.cashapp : ''}
                    placeholder='i.e. "$username"'
                    onChange = {(e)=>handleInputChange(e, 'cashapp')}
                />
                <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Deposit Message</p>
                <input
                    type="text"
                    name="location"
                    value={isValueChanged.deposits ? state.deposits : ''}
                    placeholder='i.e. "Deposit is required to book an appointment."'
                    onChange = {(e)=>handleInputChange(e, 'deposits')}
                />
            </div>

            <p style={{alignItems: "center", justifyContent: "center", width: "100%", textAlign: "left"}}>Payment Types</p>
            <RadioButtons arr = {['Venmo', 'PayPal', 'CashApp']} callBack = {(e) => handleSelectChange(e, 'paymentType')} radioRow = {true} selectMult = {true}/>

        </div>
    )
}

export default BookingRulesForm

