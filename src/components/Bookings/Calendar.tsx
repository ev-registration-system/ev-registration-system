import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Event, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../../firebase';
import ReservationButtons from './ReservationButtons';

const localizer = momentLocalizer(moment);
const ref = collection(db, "bookings");

export default function Calendar() {

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getBookings = async () => {
    const querySnapshot = await getDocs(ref);
    
    const bookings = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        start: data.startTime.toDate(),
        end: data.endTime.toDate(),
      };
    });
    setBookings(bookings); // Update state with the fetched bookings
    setLoading(false); // Indicate loading is done
  };

useEffect(() => {
  getBookings(); // Fetch bookings when the component mounts
}, []); 
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
        />
      ) }
      <ReservationButtons />
    </div>
  );
}
