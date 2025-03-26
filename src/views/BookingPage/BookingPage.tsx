import { useEffect, useState, useCallback } from 'react'
import Calendar from '../../components/Bookings/Calendar'
import ReservationModal from '../../components/Bookings/ReservationModal'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase'
import { Booking } from '../../types/types'
import { tokens } from '../../Theme'
import { Box, Button, useTheme } from '@mui/material'
import { checkForValidReservation, handleCheckInCheckOut } from '../../components/Bookings/CheckInCheckOut';
import { getUserId } from '../../utils/getUserId';

const ref = collection(db, 'bookings')

const BookingPage = () => {
	const [bookings, setBookings] = useState<{ userBookings: Booking[], otherBookings: Booking[] }>({
        userBookings: [],
        otherBookings: [],
    });
	const [loading, setLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)
	const [isCheckedIn, setIsCheckedIn] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);

	const getBookings = useCallback (async () => {
        const userId = getUserId();
        if (!userId) {
            console.error("User not authenticated");
            return [];
        }
		
        const querySnapshot = await getDocs(ref);
        const allBookings = querySnapshot.docs.map(doc => {
            const data = doc.data();
			console.log(data)
			return {
				id: doc.id,
				startTime: data.startTime.toDate(),
				endTime: data.endTime.toDate(),
                userId: data.userId,
                checkedIn: data.checkedIn || false,
                vehicleId: data.vehicleId,
			}
		})

        const userBookings = allBookings.filter(booking => booking.userId === userId);
        const otherBookings = allBookings.filter(booking => booking.userId !== userId);
		console.log(userBookings)
		setBookings({userBookings, otherBookings}) // Update state with the fetched bookings
		setLoading(false) // Indicate loading is done
	}, [setBookings]);

	useEffect(() => {
		getBookings() // Fetch bookings when the component mounts
	}, [getBookings]);

	const openModal = () => {
		setIsModalOpen(true)
	}

	const closeModal = () => {
		getBookings()
		setIsModalOpen(false)
	}

	useEffect(() => {
		async function runCheck() {
			const hasValidReservation = (await checkForValidReservation()).state;
			setIsDisabled(!hasValidReservation);
		  }
		  runCheck();
	}, []);
	
	return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{
                backgroundColor: colors.primary[400],
                padding: 2,
                borderRadius: 2,
                width: '100%',
            }}
        >
            {/* Calendar */}
            <Box
                sx={{
                    flex: 4, // 4/5 of the width
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'auto',
                }}
            >
                {loading ? (
                    <p>Loading bookings...</p>
                ) : (
                    <Calendar bookings={{ userBookings: bookings.userBookings, otherBookings: bookings.otherBookings }} getBookings={getBookings} />
                )}
            </Box>

            {/* Buttons */}
            <Box
                sx={{
                    flex: 1, // 1/5 of the width
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '20px', 
                }}
            >
                {/* Make a Reservation Button */}
                <Button
                    variant="contained"
                    sx={{
                        color: colors.grey[100],
                        backgroundColor: colors.primary[400],
                        fontWeight: 'bold',
						width: '80%',
                        height: '50px', 
                        '&:hover': {
                            backgroundColor: colors.accent[400],
                        },
                    }}
                    onClick={openModal}
                >
                    Make a Reservation
                </Button>

                {/* Upcoming Bookings Button */}
                <Button
                    variant="contained"
                    sx={{
                        color: colors.grey[100],
                        backgroundColor: colors.primary[400],
                        fontWeight: 'bold',
						width: '80%',
                        height: '50px', 
                        '&:hover': {
                            backgroundColor: colors.accent[400],
                        },
                    }}
                    onClick={() => console.log("Upcoming bookings clicked")}
                >
                    Upcoming Bookings
                </Button>

                {/* Past Bookings Button */}
                <Button
                    variant="contained"
                    sx={{
                        color: colors.grey[100],
                        backgroundColor: colors.primary[400],
                        fontWeight: 'bold',
						width: '80%',
                        height: '50px', 
                        '&:hover': {
                            backgroundColor: colors.accent[400],
                        },
                    }}
                    onClick={() => console.log('Past Bookings clicked')}
                >
                    Past Bookings
                </Button>

				{/* Check-In Check-Out Button*/}
				<Button
                    variant="contained"
                    sx={{
                        color: colors.grey[100],
                        backgroundColor: colors.primary[400],
                        fontWeight: "bold",
						width: '80%',
                        height: '50px', 
                        '&:hover': {
                            backgroundColor: colors.accent[400]
                        },
                    }}
                    onClick={() => handleCheckInCheckOut(isCheckedIn, setIsCheckedIn, setIsDisabled)}
					disabled={isDisabled}
                >
                    {isCheckedIn ? 'Check out' : 'Check in'}
                </Button>
            </Box>

            {/* Reservation Modal */}
            {isModalOpen && <ReservationModal isOpen={isModalOpen} onClose={closeModal} />}
        </Box>
    );
};

export default BookingPage;