import { useEffect, useState } from 'react'
import Calendar from '../../components/Bookings/Calendar'
import ReservationModal from '../../components/Bookings/ReservationModal'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase'
import { Booking } from '../../types/types'
import { tokens } from '../../Theme'
import { Box, Button, useTheme } from '@mui/material'

const ref = collection(db, 'bookings')

const BookingPage = () => {
	const [bookings, setBookings] = useState<Booking[]>([])
	const [loading, setLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)
	const [isCheckedIn, setIsCheckedIn] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);

	const getBookings = async () => {
		const querySnapshot = await getDocs(ref)
		const bookings = querySnapshot.docs.map(doc => {
			const data = doc.data()
			console.log(data)
			return {
				id: doc.id,
				start: data.startTime.toDate(),
				end: data.endTime.toDate(),
			}
		})
		console.log(bookings)
		setBookings(bookings) // Update state with the fetched bookings
		setLoading(false) // Indicate loading is done
	}

	useEffect(() => {
		getBookings() // Fetch bookings when the component mounts
	}, [])

	const openModal = () => {
		setIsModalOpen(true)
	}

	const closeModal = () => {
		getBookings()
		setIsModalOpen(false)
	}

	useEffect(() => {
		async function runCheck() {
			const hasValidReservation = await checkForValidReservation();
			setIsDisabled(!hasValidReservation);
		  }
		  runCheck();
	  }, []);
	
	async function checkForValidReservation() {
		console.log("getting docs");
		const querySnapshot = await getDocs(ref)
		console.log("snapshot" + querySnapshot)
		const bookings = querySnapshot.docs.map(doc => {
			const data = doc.data()
			return {
				id: doc.id,
				start: data.startTime.toDate(),
				end: data.endTime.toDate(),
			}
		})
		console.log("docs: " + bookings);

		const mockData = [
			{
			  id: 'mock-1',
			  start: new Date('2025-01-20T10:00:00'),
			  end: new Date('2025-01-20T12:00:00'),
			},
			{
			  id: 'mock-2',
			  start: new Date('2025-01-27T10:00:00'),
			  end: new Date('2025-01-27T12:00:00'),
			},
		];


		let foundValid = false;
		const GRACE_PERIOD = 5 * 60 * 1000; // 5 minutes measured in ms
		mockData.forEach(booking => {
			const now = new Date().getTime();
			const start = booking.start.getTime();
			const end = booking.end.getTime();
			const graceStart = start - GRACE_PERIOD;

			
			if (now >= graceStart && now <= end) {
				foundValid = true;
			}
		});
		return foundValid;

	}
	const handleCheckInCheckOut = async () => {

		if (isCheckedIn) {
			console.log('Checking out')
			setIsCheckedIn(false);

		}
		else {
			const isValid = await checkForValidReservation();

			if (!isValid) {
				console.log('no reservation found');
			}
			else {
				console.log('valid time found'); // turn ev charger on
				setIsCheckedIn(true);
				console.log('Checking in');

				setIsDisabled(true);
				setTimeout(() => {
				  setIsDisabled(false);
				}, 5000);
			}
		}		
	}

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
                    <Calendar bookings={bookings} getBookings={getBookings} />
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
                    onClick={() => console.log('Upcoming Bookings clicked')}
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
            </Box>

            {/* Reservation Modal */}
            {isModalOpen && <ReservationModal isOpen={isModalOpen} onClose={closeModal} />}
        </Box>
    );
};

export default BookingPage;