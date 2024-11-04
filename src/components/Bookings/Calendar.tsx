import React, { useState, useEffect, useRef } from 'react';
import '../../stylings/ReservationButtons.css'
import { Calendar as BigCalendar, momentLocalizer, Event, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { collection, getDocs, Timestamp, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import DeleteBooking from './DeleteBooking'; 

interface Booking { // booking type that gets passed to 'onSelectBooking'
  id: string; // unique booking id 
  start: Date;
  end: Date;
}

const localizer = momentLocalizer(moment);
const ref = collection(db, "bookings");



export default function Calendar() {

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null); // Keep track of the currently selected booking's ID. If none is selected then equal to NULL
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);  // To control the visibility of the delete confirmation modal. True when open, False when closed.

  const getBookings = async () => {
    const querySnapshot = await getDocs(ref);
    
    const bookings = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        start: data.startTime.toDate(),
        end: data.endTime.toDate(),
        id: doc.id,
      };
    });
    setBookings(bookings); // Update state with the fetched bookings
    setLoading(false); // Indicate loading is done
  };

  useEffect(() => {
    getBookings(); // Fetch bookings when the component mounts
  }, []);

  const startTime = useRef<HTMLInputElement>(null);
  const endTime = useRef<HTMLInputElement>(null);

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
            await getBookings();
            console.log("Booking added!");
        } catch (error) {
            console.error("Error adding booking: ", error);
        }
    }
  };

  //select booking function 
  const onSelectBooking = (booking: Booking) => {  
    console.log('Selected booking:', booking);
    setSelectedBookingId(booking.id); // Set the selected booking id to the one that is selected
    setDeleteModalOpen(true); // Open the delete modal
  }

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false); // Close the delete modal
    setSelectedBookingId(null); // Reset selected booking ID
  };

  const refreshBookings = () => {
    getBookings(); // Refresh bookings after deletion
  };

  return (

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
        <BigCalendar
          localizer={localizer}
          events={bookings} // Replace with your events array when ready
          defaultView={Views.WEEK}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', width: '100%' }} 
          onSelectEvent={(booking: Booking) => onSelectBooking(booking)} // when a booking is selected, trigger 'onSelectBooking'
        />
        
      ) }

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', margin: '20px' }}>
        <input type="datetime-local" ref={startTime} placeholder="Enter the start time" required />
        <input type="datetime-local" ref={endTime} placeholder="Enter the end time" required />
      </div>
      <DeleteBooking 
                isOpen={isDeleteModalOpen} 
                onClose={handleDeleteModalClose} 
                bookingId={selectedBookingId} 
                onDelete={refreshBookings} 
            />
    </div>
  );
}
