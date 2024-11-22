import React from 'react';
import { db } from '../../../firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import Modal from 'react-modal';

// Define the props for the DeleteBooking function
interface DeleteBookingProps { 
    isOpen: boolean; // Check if modal is open or close
    onClose: () => void; // Function to close the modal
    bookingId: string | null; // ID of the booking to be deleted (NULL if none selected)
    onDelete: () => void; // Function to refresh bookings after deletion
}

// Function to delete bookings 
const DeleteBooking: React.FC<DeleteBookingProps> = ({ isOpen, onClose, bookingId, onDelete }) => {
    const handleDelete = async () => {
        if (bookingId) { // Only proceed if a bookingId is provided
            const bookingRef = doc(collection(db, 'bookings'), bookingId); // Reference to the booking document in Firestore DB
            try {
                await deleteDoc(bookingRef); // Delete the doc from Firestone
                console.log("Booking " + bookingId + " deleted"); 
                onDelete(); // Call function to refresh bookings after deletion
            } catch (error) {
                console.error("Error deleting booking: ", error);
            }
        } else {
            console.log("No booking ID provided.");
        }
        onClose(); 
    };

    return (
    <Modal //confirmation modal
    isOpen={isOpen}
    onRequestClose={onClose}
    appElement={document.getElementById('root') || undefined} // This is needed so screen readers don't see main content when modal is opened. This code removes the warning. 
    ariaHideApp={true}
    style={{
        content: {
            width: '300px',
            height: '150px',
            margin: 'auto',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            backdropFilter: 'blur(5px)', // adds a blur effect to the background (cool)
        },
    }}
    >
    <p>Are you sure you want to delete this reservation?</p>
    <div>
    <button onClick={handleDelete} style={{ marginRight: '10px' }}>Yes</button> 
    <button onClick={onClose}>Cancel</button>
    </div>
    </Modal>
    );
};

export default DeleteBooking;
