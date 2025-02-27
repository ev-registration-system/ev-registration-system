import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Booking } from '../../types/types'
import DeleteBooking from './DeleteBooking';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../Theme';
import { getUserId } from '../../utils/users';

interface CalendarProps {
  bookings: { userBookings: Booking[], otherBookings: Booking[] };
  getBookings: () => void;
}

const localizer = momentLocalizer(moment);

const Calendar: React.FC<CalendarProps> = ({ bookings, getBookings }) => {

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null); // Keep track of the currently selected booking's ID. If none is selected then equal to NULL
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);  // To control the visibility of the delete confirmation modal. True when open, False when closed.
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userId = getUserId();

  //select booking function 
  const onSelectBooking = (booking: Booking) => {  
    if (booking.userId === userId) {
      console.log('Selected booking:', booking);
      setSelectedBookingId(booking.id);
      setDeleteModalOpen(true);
    } else {
      console.log('You cannot delete this booking.');
    }
  }

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false); // Close the delete modal
    setSelectedBookingId(null); // Reset selected booking ID
  };

  return (
    <div>
      <BigCalendar
          localizer={localizer}
          events={[...bookings.userBookings, ...bookings.otherBookings]} // Replace with your events array when ready
          defaultView={Views.WEEK}
          startAccessor="startTime"
          endAccessor="endTime"
          style={{ height: '100%', width: '100%' }}
          onSelectEvent={(booking: Booking) => onSelectBooking(booking)} // when a booking is selected, trigger 'onSelectBooking'
          eventPropGetter={(event) => {
            return {
                style: {
                    backgroundColor: bookings.userBookings.some(b => b.id === event.id) 
                        ? colors.accent[500]
                        : colors.grey[500], 
                    color: "#FFF",
                    borderRadius: "4px",
                    padding: "5px",
                },
            };
        }}
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
