import { useEffect, useState } from 'react';
import Calendar from '../../components/Bookings/Calendar';
import ReservationModal from '../../components/Bookings/ReservationModal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Booking } from '../../types/types';
import Button from '../../components/Bookings/Button';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';

const ref = collection(db, "bookings");

const BookingPage = () => {

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getBookings = async () => {
        const querySnapshot = await getDocs(ref);
        const bookings = querySnapshot.docs.map(doc => {
            const data = doc.data();
            console.log(data);
            return {
                start: data.startTime.toDate(),
                end: data.endTime.toDate(),
            };
        });
        console.log(bookings);
        setBookings(bookings); // Update state with the fetched bookings
        setLoading(false); // Indicate loading is done
    };

    useEffect(() => {
        getBookings(); // Fetch bookings when the component mounts
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        getBookings();
        setIsModalOpen(false);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth); // Logs the user out
            const navigate = useNavigate();
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the EV Registration System</h1>
            <Button onClick={handleLogout}>
                Logout
            </Button>
            <div
            style={{
                height: '600px',
                margin: '50px auto', // fancy Centering logic
                width: '80%', 
                maxWidth: '1000px',  
            }}
            >
            {loading ? (
                <p>Loading bookings...</p>
            ) : (
                <Calendar bookings={bookings}/>
            ) }
            </div>
            
            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', margin: '20px auto' }}>
                <button className="button" onClick={openModal}>Make a Reservation</button>
                <button className="button" onClick={() => console.log('Delete clicked')}>Cancel Reservation</button>
                <button className="button" onClick={() => console.log('Update clicked')}>Modify Reservation</button>
            </div>
            {isModalOpen && (
                <ReservationModal onClose={closeModal} isOpen />
            )}
        </div>
    );
};

export default BookingPage
