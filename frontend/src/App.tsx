// import React from 'react';
// import { db } from './firebase'
// import { collection, getDocs } from 'firebase/firestore'
import CreateBooking from './components/bookings'
import Calendar from './components/calendar'

function App() {

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the EV Registration System</h1>
            <Calendar />
            
        </div>
    );
}

export default App;



// <CreateBooking />