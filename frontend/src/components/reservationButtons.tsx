import React from 'react';
import '../stylings/reservationButtons.css'

export default function reservationButtons() {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', width: '50%', margin: '20px auto'}}>
            <button className="button" onClick={() => console.log('Reserve clicked')}>Make a Reservation</button>
            <button className="button" onClick={() => console.log('Delete clicked')}>Cancel Reservation</button>
            <button className="button" onClick={() => console.log('Update clicked')}>Modify Reservation</button>
        </div>
    )   
}