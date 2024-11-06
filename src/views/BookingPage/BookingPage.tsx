import { useEffect, useState } from 'react';
import Calendar from '../../components/Bookings/Calendar';
import ReservationModal from '../../components/Bookings/ReservationModal';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { getFunctions, httpsCallable } from "firebase/functions"; // Import the modular functions API
import { app } from "../../../firebase";

interface Booking {
    id: number;
    docId: string;
    startTime: Date;
    endTime: Date;
}

interface UpdateBookingResponse {
    success: boolean;
    message: string;
}

const BookingPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]); // State to hold fetched bookings
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookingsCollection = collection(db, "bookings");
                const bookingsSnapshot = await getDocs(bookingsCollection);
                const fetchedBookings = bookingsSnapshot.docs.map((doc, index) => ({
                    id: index,
                    docId: doc.id,
                    ...doc.data() as Omit<Booking, "id" | "docId">,
                }));
                
                setBookings(fetchedBookings); // Update the bookings state with fetched data
                console.log("Bookings:", fetchedBookings); // Logs all bookings to console
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

    const editBooking = async () => {
        if (bookings.length > 0) {
            const bookingToEdit = bookings[0];

            const startDateTime = "2024-11-04T7:00:00";
            const endDateTime = "2024-11-04T8:00:00";

            try {
                const functions = getFunctions(app);
                const updateBookingFunction = httpsCallable(functions, "updateBooking");

                // Call the Cloud Function
                const result = await updateBookingFunction({
                    bookingId: bookingToEdit.docId,
                    newStartTime: startDateTime,
                    newEndTime: endDateTime,
                });

                // Use type assertion to specify the type of result.data
                const data = result.data as UpdateBookingResponse;

                // Handle the response
                if (data.success) {
                    console.log(data.message); // "Booking updated successfully."
                } else {
                    console.error("Failed to update booking:", data.message);
                }
            } catch (error) {
                console.error("Error calling Cloud Function:", error);
            }
        } else {
            console.log("No bookings available to edit");
        }
    };

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