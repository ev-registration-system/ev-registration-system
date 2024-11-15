import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { collection, getDocs, Timestamp, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Button, useTheme } from '@mui/material';
import Modal from 'react-modal';
import { tokens } from '../Theme';

const localizer = momentLocalizer(moment);
const bookingRef = collection(db, "bookings");

interface Booking {
    id: string;
    start: Date;
    end: Date;
}

const BookingCalendar = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isReservationModalOpen, setReservationModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const theme = useTheme();
    const colors = tokens(theme.palette.mode); 

    // Fetch bookings from Firestore
    // BookingCalendar.tsx

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
    const closeReservationModal = () => {
        setReservationModalOpen(false);
        setStartTime('');
        setEndTime('');
    };

    // Add a new booking to Firestore
    const handleReservationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (startTime && endTime) {
            const start = new Date(startTime);
            const end = new Date(endTime);
            const bookingData = {
                startTime: Timestamp.fromDate(start),
                endTime: Timestamp.fromDate(end)
            };
            try {
                await addDoc(bookingRef, bookingData);
                getBookings(); // Refresh bookings
                closeReservationModal();
                console.log("Booking added successfully!");
            } catch (error) {
                console.error("Error adding booking: ", error);
            }
        }
    };

    // Open delete modal
    const onSelectBooking = (booking: Booking) => {
        setSelectedBookingId(booking.id);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedBookingId(null);
    };

    // Delete a booking from Firestore
    const handleDeleteBooking = async () => {
        if (selectedBookingId) {
            const bookingDoc = doc(db, "bookings", selectedBookingId);
            try {
                await deleteDoc(bookingDoc);
                getBookings(); // Refresh bookings
                closeDeleteModal();
                console.log("Booking deleted successfully!");
            } catch (error) {
                console.error("Error deleting booking: ", error);
            }
        }
    };

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
                        onSelectEvent={onSelectBooking}
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
            <Modal
                isOpen={isReservationModalOpen}
                onRequestClose={closeReservationModal}
                style={{
                    overlay: {
                        zIndex: 2000, // Ensure overlay appears above other elements
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background for better focus
                    },
                    content: {
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '500px',
                        width: '90%', // Responsive width
                        padding: '20px',
                        borderRadius: '8px',
                        zIndex: 2001, // Ensure content is above overlay
                    }
                }}
            >
                <div className='ModalWrapper'>
                    <div className='ModalContent'>
                        <h2>Make a Reservation</h2>
                        <form onSubmit={handleReservationSubmit}>
                            <label>
                                Start Time:
                                <input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </label>
                            <br /><br />
                            <label>
                                End Time:
                                <input
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                />
                            </label>
                            <br /><br />
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={closeReservationModal}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>

            {/* Delete Booking Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onRequestClose={closeDeleteModal}
                style={{
                    content: {
                        width: '300px',
                        height: '150px',
                        margin: 'auto',
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(5px)',
                    },
                }}
            >
                <p>Are you sure you want to delete this reservation?</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button onClick={handleDeleteBooking}>Yes</button>
                    <button onClick={closeDeleteModal}>Cancel</button>
                </div>
            </Modal>
        </div>
    );
};

export default BookingCalendar;

