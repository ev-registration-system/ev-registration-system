import { useState } from 'react';
import Calendar from '../../components/Bookings/Calendar';
import ReservationModal from '../../components/Bookings/ReservationModal';
import Button from '../../components/Bookings/Button';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';

const BookingPage = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth); // Logs the user out
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the EV Registration System</h1>
            <Button onClick={handleLogout}>
                Logout
            </Button>
            <Calendar/>
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