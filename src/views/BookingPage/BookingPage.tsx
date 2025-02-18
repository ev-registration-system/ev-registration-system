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

	const getBookings = async () => {
		const querySnapshot = await getDocs(ref)
		const bookings = querySnapshot.docs.map(doc => {
			const data = doc.data()
			console.log(data)
			return {
				id: doc.id,
				startTime: data.startTime.toDate(),
				endTime: data.endTime.toDate(),
                userId: data.userId,
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