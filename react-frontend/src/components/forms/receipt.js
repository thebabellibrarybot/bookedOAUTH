import React from 'react'

const Receipt = ({ eventInfo, bookingFormInfo }) => {
  
    return (
        <div className='content'>
            <div className='form-line'>
                <div className="receipt-header">
                    <h2>Receipt</h2>
                    <p>Date: {eventInfo.date.split('T')[0]}</p>
                    <p>Time: {eventInfo.time}</p>
                </div>

                <div className="receipt-content">
                    <div className="customer-info">
                        <p>Customer: {eventInfo.name}</p>
                    </div>

                    <div className="item-list">
                        <h3>Tatto Info:</h3>
                        {}
                    </div>

                    <div className="total-amount">
                        <p>Estimated Amount: {bookingFormInfo.tattooInfo.hourlyPrice}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Receipt
