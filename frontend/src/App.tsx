// import React from 'react';
// import { db } from './firebase'
// import { collection, getDocs } from 'firebase/firestore'
import CreateBooking from './components/bookings'
import Calendar from './components/calendar'
import Rbuttons from './components/reservationButtons'

function App() {

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the EV Registration System</h1>
            <Calendar />
            <Rbuttons />
        </div>
    );
}

export default App;



// <CreateBooking />