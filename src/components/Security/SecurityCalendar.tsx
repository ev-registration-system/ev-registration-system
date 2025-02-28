import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Booking } from '../../types/types';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../Theme';

interface SecurityCalendarProps {
  bookings: Booking[];
}

const localizer = momentLocalizer(moment);

const SecurityCalendar: React.FC<SecurityCalendarProps> = ({ bookings }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const today = moment().startOf('day');

  //Convert Firestore Timestamp to Date
  const convertToDate = (timestamp: any) => {
    return timestamp?.toDate ? timestamp.toDate() : timestamp;
  };

  //Filter bookings to only show today's bookings
  const todaysBookings = bookings.filter((booking) => 
    moment(convertToDate(booking.startTime)).isSame(today, 'day')
  );

  return (
    <div>
      <BigCalendar
        localizer={localizer}
        events={todaysBookings.map((booking) => ({
          ...booking,
          startTime: convertToDate(booking.startTime),
          endTime: convertToDate(booking.endTime),
        }))}
        defaultView={Views.DAY}
        startAccessor="startTime"
        endAccessor="endTime"
        style={{ height: '100%', width: '100%' }}
        eventPropGetter={() => ({
          style: {
            backgroundColor: colors.accent[500],
            color: "#FFF",
            borderRadius: "4px",
            padding: "5px",
          },
        })}
      />
    </div>
  );
};

export default SecurityCalendar;