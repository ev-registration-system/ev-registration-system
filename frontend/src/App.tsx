// import React from 'react';
// import { db } from './firebase'
// import { collection, getDocs } from 'firebase/firestore'
import CreateBooking from './bookings'

function App() {

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the EV Registration System</h1>
            <CreateBooking />
        </div>
    );
}

export default App;

