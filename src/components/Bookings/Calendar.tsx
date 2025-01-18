import { useState, useEffect, useRef } from 'react';
//import '../../stylings/ReservationButtons.css'
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

const localizer = momentLocalizer(moment);
const ref = collection(db, "bookings");

export default function Calendar() {

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getBookings = async () => {
    const querySnapshot = await getDocs(ref);
    const bookings = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(data);
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

  const startTime = useRef<HTMLInputElement>(null);
  const endTime = useRef<HTMLInputElement>(null);

  return (

    <div className="container mx-auto my-12 max-w-4xl">
    {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <BigCalendar
          localizer={localizer}
          events={bookings} // Replace with your events array when ready
          defaultView={Views.WEEK}
          startAccessor="start"
          endAccessor="end"
          className="h-[600px] w-[500]"
        />
      ) }

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', margin: '20px' }}>
        <input type="datetime-local" ref={startTime} placeholder="Enter the start time" required />
        <input type="datetime-local" ref={endTime} placeholder="Enter the end time" required />
      </div>
    </div>
  );
}
