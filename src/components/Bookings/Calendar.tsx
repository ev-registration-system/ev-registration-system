// import React, { useState, useEffect, useRef } from 'react';
import '../../stylings/ReservationButtons.css'
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Booking } from '../../types/types.ts'

interface CalendarProps {
  bookings: Booking[];
}

const localizer = momentLocalizer(moment);

const Calendar: React.FC<CalendarProps> = ({ bookings }) => {
  return (
    <BigCalendar
      localizer={localizer}
      events={bookings} // Replace with your events array when ready
      defaultView={Views.WEEK}
      startAccessor="start"
      endAccessor="end"
      style={{ height: '100%', width: '100%' }} 
    />
  );
}

export default Calendar;
