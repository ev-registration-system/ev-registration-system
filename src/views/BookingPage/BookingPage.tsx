import { useState } from 'react';
import Calendar from '../../components/Bookings/Calendar';
import ReservationModal from '../../components/Bookings/ReservationModal';
import EditBookingModal from '../../components/Bookings/EditReservationModal';

const BookingPage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);


    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };
    
    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the EV Registration System</h1>
            <Calendar/>
            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', margin: '20px auto' }}>
                <button className="button" onClick={openModal}>Make a Reservation</button>
                <button className="button" onClick={() => console.log('Delete clicked')}>Cancel Reservation</button>
                <button className="button" onClick={openEditModal}>Modify Reservation</button>
            </div>
            {isModalOpen && <ReservationModal onClose={closeModal} isOpen />}
            {/*isEditModalOpen && <EditBookingModal onClose={closeEditModal} isOpen />*/}
        </div>
    );
};

export default BookingPage