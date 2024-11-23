import { useEffect, useState } from 'react';
import Calendar from '../../components/Bookings/Calendar';
import ReservationModal from '../../components/Bookings/ReservationModal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Booking } from '../../types/types';
import { tokens } from '../../Theme';
import { Button, useTheme } from '@mui/material';

const ref = collection(db, "bookings");

const BookingPage = () => {

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const getBookings = async () => {
        const querySnapshot = await getDocs(ref);
        const bookings = querySnapshot.docs.map(doc => {
            const data = doc.data();
            console.log(data);
            return {
                id: doc.id,
                start: data.startTime.toDate(),
                end: data.endTime.toDate(),
            };
        });
        console.log(bookings);
        setBookings(bookings); // Update state with the fetched bookings
        setLoading(false); // Indicate loading is done
    };

    useEffect(() => {
        getBookings(); // Fetch bookings when the component mounts
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        getBookings();
        setIsModalOpen(false);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <div
            style={{
                height: '100%',
                margin: '50px auto', // fancy Centering logic
                width: '100%',
            }}
            >
            {loading ? (
                <p>Loading bookings...</p>
            ) : (
                <Calendar bookings={bookings} getBookings={getBookings}/>
            ) }
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', margin: '20px auto' }}>
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
                    onClick={openModal}
                >
                    Make a Reservation
                </Button>
            </div>
            {isModalOpen && (
                <ReservationModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default BookingPage;
