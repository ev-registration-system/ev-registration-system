import React, { useState } from 'react';
import Modal from 'react-modal';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebase';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBookingCreated: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, onBookingCreated }) => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const bookingRef = collection(db, "bookings");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (startTime && endTime) {
            const start = new Date(startTime);
            const end = new Date(endTime);
            const bookingData = {
                startTime: Timestamp.fromDate(start),
                endTime: Timestamp.fromDate(end)
            };
            try {
                await addDoc(bookingRef, bookingData);
                onBookingCreated();
                onClose(); 
            } catch (error) {
                console.error("Error adding booking:", error);
            }
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: { zIndex: 2000, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                content: {
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '500px',
                    width: '90%',
                    padding: '20px',
                    borderRadius: '8px',
                    zIndex: 2001,
                }
            }}
        >
            <div>
                <h2>Make a Reservation</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Start Time:
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </label>
                    <br /><br />
                    <label>
                        End Time:
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </label>
                    <br /><br />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ReservationModal;