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
  return (
    <div
      style={{
        height: '600px',
        margin: '50px auto', // fancy Centering logic
        width: '80%', 
        maxWidth: '1000px',  
      }}
    >
      <BigCalendar
        localizer={localizer}
        events={[]} // Replace with your events array when ready
        defaultView={Views.WEEK}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', width: '100%' }} 
      />
    </div>
  );
}
