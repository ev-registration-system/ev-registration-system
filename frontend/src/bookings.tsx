import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import { useRef } from "react";

export default function CreateBooking() {
    const startTime = useRef<HTMLInputElement>(null);
    const endTime = useRef<HTMLInputElement>(null);
    const ref = collection(db, "bookings");

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (startTime.current && endTime.current) {

            //convert input values to Date objects
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
        <form onSubmit={handleBooking}>
            <input type="datetime-local" ref={startTime} placeholder="Enter the start time" required />
            <input type="datetime-local" ref={endTime} placeholder="Enter the end time" required />
            <button type="submit">Submit</button>
        </form>
    );
}