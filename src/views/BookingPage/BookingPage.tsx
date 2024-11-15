import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Button, useTheme } from '@mui/material';
import { tokens } from '../../Theme';
import ReservationModal from '../../components/Bookings/ReservationModal'; 
import DeleteBooking from '../../components/Bookings/DeleteBooking'; 

const localizer = momentLocalizer(moment);
const bookingRef = collection(db, "bookings");

interface Booking {
    id: string;
    start: Date;
    end: Date;
}

const BookingPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isReservationModalOpen, setReservationModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Fetch bookings from Firestore
    const getBookings = async () => {
        try {
            const querySnapshot = await getDocs(bookingRef);
            const fetchedBookings = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    start: data.startTime instanceof Timestamp ? data.startTime.toDate() : new Date(data.startTime),
                    end: data.endTime instanceof Timestamp ? data.endTime.toDate() : new Date(data.endTime),
                };
            });
            setBookings(fetchedBookings);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getBookings();
    }, []);

    // Open and close reservation modal
    const openReservationModal = () => setReservationModalOpen(true);
    const closeReservationModal = () => setReservationModalOpen(false);

    // Open delete modal and set selected booking ID
    const openDeleteModal = (bookingId: string) => {
        setSelectedBookingId(bookingId);
        setDeleteModalOpen(true);
    };
    const closeDeleteModal = () => setDeleteModalOpen(false);

    return (
        <div style={{ textAlign: 'center', marginTop: '5px' }}>
            {/* Calendar */}
            <div style={{ height: '600px', margin: '50px auto', width: '100%', maxWidth: '1000px' }}>
                {loading ? (
                    <p>Loading bookings...</p>
                ) : (
                    <BigCalendar
                        localizer={localizer}
                        events={bookings}
                        defaultView={Views.WEEK}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '80%', width: '100%' }}
                        onSelectEvent={(booking) => openDeleteModal(booking.id)}
                    />
                )}

                {/* Make Reservation Button */}
                <div style={{ marginTop: '20px' }}>
                    <Button
                        variant="contained"
                        sx={{
                            color: colors.grey[100],
                            backgroundColor: colors.primary[400],
                            fontWeight: "bold",
                            '&:hover': {
                                backgroundColor: colors.accent[400]
                            },
                        }}
                        onClick={openReservationModal}
                    >
                        Make a Reservation
                    </Button>
                </div>
            </div>

            {/* Reservation Modal */}
            <ReservationModal
                isOpen={isReservationModalOpen}
                onClose={closeReservationModal}
                onBookingCreated={getBookings}
            />

            {/* Delete Booking Modal */}
            <DeleteBooking
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                bookingId={selectedBookingId}
                onDelete={getBookings}
            />
        </div>
    );
};

export default BookingPage;
