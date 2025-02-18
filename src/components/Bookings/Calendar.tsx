import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Booking } from '../../types/types'
import DeleteBooking from './DeleteBooking';
import { useState } from 'react';

interface CalendarProps {
  bookings: Booking[];
  getBookings: () => void;
}

const localizer = momentLocalizer(moment);

const Calendar: React.FC<CalendarProps> = ({ bookings, getBookings }) => {

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null); // Keep track of the currently selected booking's ID. If none is selected then equal to NULL
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);  // To control the visibility of the delete confirmation modal. True when open, False when closed.

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

  return (
    <div>
      <BigCalendar
          localizer={localizer}
          events={bookings} // Replace with your events array when ready
          defaultView={Views.WEEK}
          startAccessor="startTime"
          endAccessor="endTime"
          style={{ height: '100%', width: '100%' }}
          onSelectEvent={(booking: Booking) => onSelectBooking(booking)} // when a booking is selected, trigger 'onSelectBooking'
      />

      <DeleteBooking 
                  isOpen={isDeleteModalOpen} 
                  onClose={handleDeleteModalClose} 
                  bookingId={selectedBookingId} 
                  onDelete={getBookings} 
      />
    </div>

  );
}

export default Calendar;
