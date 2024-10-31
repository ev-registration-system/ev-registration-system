import React, { useState, useEffect } from 'react';
import '../../stylings/ReservationButtons.css';
import '../../stylings/ModalStyling.css';
import { collection, getDocs, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Modal from 'react-modal';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditBookingModal({ onClose, isOpen }: EditBookingModalProps) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const bookingsRef = collection(db, 'bookings');

  const fetchBookings = async () => {
    const querySnapshot = await getDocs(bookingsRef);
    const bookingsData = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        startTime: data.startTime.toDate(),
        endTime: data.endTime.toDate(),
      };
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);

        if (startTime && endTime) {
            const start = new Date(startTime);
            const end = new Date(endTime);
            let data = {
                startTime: Timestamp.fromDate(start),
                endTime: Timestamp.fromDate(end)
            };


        }

        onClose();
    };

    return (
        <div>
            <Modal isOpen={isOpen} onRequestClose={onClose} style={{overlay: {zIndex:1000}}}>
                <div className='ModalWrapper'>
                    <div className='ModalContent'>
                        <h2>Make a Reservation</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Start Time:
                                <br/>
                                <input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </label>
                            <br/>
                            <br/>
                            <label>
                                End Time
                                <br/>
                                <input 
                                    type="datetime-local" 
                                    value={endTime} 
                                    onChange={(e) => setEndTime(e.target.value)} 
                                    required 
                                />
                            </label>
                            <br/>
                            <br/>
                            <div style={{display: 'flex',gap: '10px',justifyContent: 'center',marginTop: '20px'}}>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={onClose}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </div> 
    ); 
}
}