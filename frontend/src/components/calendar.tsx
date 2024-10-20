import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Event, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';

const localizer = momentLocalizer(moment);

interface BookingEvent extends Event {
  id: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<BookingEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const bookingsCollection = collection(db, 'bookings');
      const bookingsSnapshot = await getDocs(bookingsCollection);
      const bookingsData = bookingsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: 'Reserved',
          start: data.startTime.toDate(),
          end: data.endTime.toDate(),
        } as BookingEvent;
      });
      setEvents(bookingsData);
    };

    fetchEvents();
  }, []);

  return (
    <div style={{ height: '600px', margin: '50px' }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        defaultView={Views.WEEK}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>
  );
}
