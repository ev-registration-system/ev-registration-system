import { useEffect, useState, useCallback } from 'react'
import Calendar from '../../components/Bookings/Calendar'
import ReservationModal from '../../components/Bookings/ReservationModal'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase'
import { Booking } from '../../types/types'
import { tokens } from '../../Theme'
import { Box, Button, MenuItem, Select, useTheme } from '@mui/material'
import { checkForValidReservation, handleCheckInCheckOut } from '../../components/Bookings/CheckInCheckOut';
import { getUserId } from '../../utils/getUserId';
import PreviousBookings from '../../components/Bookings/PreviousBookings';
import UpcomingBookings from '../../components/Bookings/UpcomingBookings';

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
    const [PreviousBooking, setPreviousBookings] = useState(false)
    const [UpcomingBooking, setUpcomingBookings] = useState(false)
    const [chargerIDs, setChargersIDs] = useState<string[]>([]);
    const [chargerSelected, setChargersSelected] = useState<string>();

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
                chargerID: data.chargerID
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

    const handlePreviousBookingsOpen = () => {
        console.log("Here")
        setPreviousBookings(true);
    }

    const handlePreviousBookingsClose = () => {
        setPreviousBookings(false);
    }
    
    const handleUpcomingBookingsOpen = () => {
        console.log("Here")
        setUpcomingBookings(true);
    }

    const handleUpcomingBookingsClose = () => {
        setUpcomingBookings(false);
    }

    const fetchChargers = useCallback(async () => {
        try {
            const chargersRef = collection(db, "chargers");
            const snapshot = await getDocs(chargersRef);
            const chargerList = snapshot.docs.map(doc => doc.id);
            setChargersIDs(chargerList);
            console.log("Chargers:::::" + chargerIDs)
        } catch (error) {
            console.error("Error fetching chargers:", error);
        }
    }, []);

	useEffect(() => {
        fetchChargers();
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
                
                <Select 
                    value={chargerSelected || "Select Charger"}
                    onChange={(e) => setChargersSelected(e.target.value)}
                    sx={{ width: 155 }}
                >
                    <MenuItem value="Select Charger" disabled>Select Charger</MenuItem>
                    {chargerIDs.map((charger) => (
                        <MenuItem key={charger} value={charger}>
                            {charger}
                        </MenuItem>
                    ))}
                </Select>


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
                    onClick={handleUpcomingBookingsOpen}
                >
                    Upcoming Bookings
                </Button>
                <UpcomingBookings open={UpcomingBooking} onClose={handleUpcomingBookingsClose} />

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
                    onClick={handlePreviousBookingsOpen}
                >
                    Past Bookings
                </Button>
                <PreviousBookings open={PreviousBooking} onClose={handlePreviousBookingsClose} />

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
            {isModalOpen && <ReservationModal isOpen={isModalOpen} onClose={closeModal} chargerID={chargerSelected} />}
        </Box>
    );
};

export default BookingPage;