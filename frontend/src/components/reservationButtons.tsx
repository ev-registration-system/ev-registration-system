import React from 'react';
import '../stylings/reservationButtons.css'
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import Modal from 'react-modal';

export default function reservationButtons() {
    //const startTime = useRef<HTMLInputElement>(null);
    //const endTime = useRef<HTMLInputElement>(null);
    const ref = collection(db, "bookings");

    const [modalIsOpen, setModelIsOpen] = useState(false)
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const openModal = () => setModelIsOpen(true);
    const closeModal = () => setModelIsOpen(false);

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

            try {
                await addDoc(ref, data);
                console.log("Booking added Successfully!");
            } catch (error) {
                console.error("Error adding booking: ", error);
            }
        }

        closeModal();
    };

    return (
        <div>
            {/* Input fields for start and end times */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', margin: '20px auto' }}>
                <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="Enter the start time" required />
                <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="Enter the end time" required />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', margin: '20px auto' }}>
                <button className="button" onClick={openModal}>Make a Reservation</button>
                <button className="button" onClick={() => console.log('Delete clicked')}>Cancel Reservation</button>
                <button className="button" onClick={() => console.log('Update clicked')}>Modify Reservation</button>
            </div>

            <div>
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
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
                        <label>
                            Time:
                            <input 
                                type="datetime-local" 
                                value={endTime} 
                                onChange={(e) => setEndTime(e.target.value)} 
                                required 
                            />
                        </label>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={closeModal}>Close</button>
                    </form>
                </Modal>
            </div>
        </div>
    );   
}