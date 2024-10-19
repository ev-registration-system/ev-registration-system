import React from 'react';
import { db } from './firebase'
import {
    collection,
    getDocs
  } from 'firebase/firestore'

function App() {

    const bookings = collection(db, 'bookings');
    const test = () => {
        getDocs(bookings)
            .then((snapshot) => {
                console.log(snapshot.docs);
            });
    }
    

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the EV Registration System</h1>
            <button onClick={test}>test</button>
        </div>
    );
}

export default App;

