import React from 'react'
import { BasicButton } from "components/buttons"
import { IoLogoVenmo } from "react-icons/io5"
import { SiPaypal, SiCashapp } from "react-icons/si"

const PaymentLinks = ({state}) => {

    return (
        <div className='form-line'>
            <h3>Have you sent a deposit?</h3>
            <p style={{display: "flex", width: "100%", textAlign: "left", justifyContent: "left"}}>Deposit Amount: {state.booking.tattooInfo.depositAmount?state.booking.tattooInfo.depositAmount:null}</p>
            <br></br>

            {state.booking.tattooInfo.paymentType.includes('Venmo') ?
                <>
                    <BasicButton IconElement={IoLogoVenmo} onClick={()=>window.open(`https://account.venmo.com/u/${state.booking.tattooInfo.venmo}`)} style={{backgroundColor: "#3D95CE", fill: "white", color: "white"}}/>
                </>
                :null}

            <br></br>

            {state.booking.tattooInfo.paymentType.includes('PayPal') ?
                <>
                    <BasicButton IconElement={SiPaypal} onClick={()=>window.open(`https://paypal.com/${state.booking.tattooInfo.paypal}`)} style={{backgroundColor: "#003087", fill: "white", color: "white"}}/>
                </>
                :null}
                
            <br></br>

            {state.booking.tattooInfo.paymentType.includes('CashApp') ?
                <>
                    <BasicButton IconElement={SiCashapp} onClick={()=>window.open(`https://cashapp.com/${state.booking.tattooInfo.cashapp}`)} style={{backgroundColor: "#3CB371", fill: "white", color: "white"}}/>
                </>
                :null}

            <br></br>

        
        </div>
    )
}
export default PaymentLinks