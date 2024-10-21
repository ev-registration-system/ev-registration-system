import React from 'react';
import '../stylings/reservationButtons.css'
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useRef } from "react";

export default function reservationButtons() {
    const startTime = useRef<HTMLInputElement>(null);
    const endTime = useRef<HTMLInputElement>(null);
    const ref = collection(db, "bookings");

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (startTime.current && endTime.current) {
            const start = new Date(startTime.current.value);
            const end = new Date(endTime.current.value);
            let data = {
                startTime: Timestamp.fromDate(start),
                endTime: Timestamp.fromDate(end)
            };

            try {
                await addDoc(ref, data);
                console.log("Booking added!");
            } catch (error) {
                console.error("Error adding booking: ", error);
            }
        }

        
    };

    return (
        <div>
            {/* Input fields for start and end times */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', margin: '20px auto' }}>
                <input type="datetime-local" ref={startTime} placeholder="Enter the start time" required />
                <input type="datetime-local" ref={endTime} placeholder="Enter the end time" required />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', margin: '20px auto' }}>
                <button className="button" onClick={handleBooking}>Make a Reservation</button>
                <button className="button" onClick={() => console.log('Delete clicked')}>Cancel Reservation</button>
                <button className="button" onClick={() => console.log('Update clicked')}>Modify Reservation</button>
            </div>
        </div>
    );   
}