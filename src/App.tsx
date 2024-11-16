// import React from 'react';
// import { db } from './firebase'
// import { collection, getDocs } from 'firebase/firestore'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BookingPage from './views/BookingPage/BookingPage'

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<BookingPage />} />
            </Routes>
        </Router>
    );
}

export default App;



// <CreateBooking />