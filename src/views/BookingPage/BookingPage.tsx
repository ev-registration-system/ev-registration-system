import { useEffect, useState } from 'react';
import Calendar from '../../components/Bookings/Calendar';
import ReservationModal from '../../components/Bookings/ReservationModal';
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";



const BookingPage = () => {
    const [bookings, setBookings] = useState([]); // State to hold fetched bookings
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookingsCollection = collection(db, "bookings");
                const bookingsSnapshot = await getDocs(bookingsCollection);
                const bookings = bookingsSnapshot.docs.map((doc, index) => ({
                    id: index, // Using index as an identifier
                    docId: doc.id, // Firestore document ID
                    ...doc.data(), // Document data
                }));
                console.log("Bookings:", bookings); // Logs all bookings to console
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, []);

    

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const editBooking = () => {
        const ref = collection(db, "bookings");


    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the EV Registration System</h1>
            <Calendar/>
            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', margin: '20px auto' }}>
                <button className="button" onClick={openModal}>Make a Reservation</button>
                <button className="button" onClick={() => console.log('Delete clicked')}>Cancel Reservation</button>
                <button className="button" onClick={editBooking}>Modify Reservation</button>
            </div>
            {isModalOpen && (
                <ReservationModal onClose={closeModal} isOpen />
            )}
        </div>
    );
};

export default BookingPage