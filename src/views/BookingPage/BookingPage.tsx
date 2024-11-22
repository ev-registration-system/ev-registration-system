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
    const [isGraphVisible, setIsGraphVisible] = useState(false);
    const [plotImage, setPlotImage] = useState<string | null>(null); // State to hold the plot image for emissions
    const [currentEmission, setCurrentEmission] = useState<number | null>(null);  // State for current emission
    const [currentHour, setCurrentHour] = useState<number | null>(null);  // State for current hour
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

    // Toggle visibility of emissions graph after clicking button
    const toggleGraph = async () => {
        if (isGraphVisible) { 
            setIsGraphVisible(false); // If graph is visible, hide it 
        } else {
            try {
                const response = await fetch('http://127.0.0.1:5000/plot'); // Network request to the backend server where Flask is running
                if (!response.ok) {
                    throw new Error('Failed to fetch plot image'); // Throw error if image can't be fetched
                }
                // 'blob' (holding img contents in binary) is waiting for server response
                const blob = await response.blob();
                // Creates temporary URL for the Blob object
                const imageUrl = URL.createObjectURL(blob);
                // State to hold plot imgage ('plotImage') is updated 
                setPlotImage(imageUrl);
                // Display graph
                setIsGraphVisible(true);
            } catch (error) {
                console.error("Error fetching plot:", error); 
            }
        }
    };

    // Fetch the current emission data for the current hour
    const fetchCurrentEmission = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/get-number');// Network request to the backend server where Flask is running
            // JSONs data is stored in 'data' once server responds
            const data = await response.json();
    
            if (data.current_emission !== undefined) {
                setCurrentEmission(data.current_emission);  // Set current emission in state
                setCurrentHour(data.hour);  // Set current hour in state
            } else {
                console.error("Error fetching current emission:", data.error); // Throw error if unable to fetch JSON from server
            }
        } catch (error) {
            console.error("Error fetching current emission:", error);
        }
    };
    // fetchCurrentEmission() runs when the componnet mounts (when page is loaded)
    useEffect(() => {fetchCurrentEmission()}, []); // Empty brackets tells React to run the useEffect hook only once

    /*
    If we get data that is real-time (updates every minute) then we can use:
    useEffect(() => {
    const interval = setInterval(() => {fetchCurrentEmission()}, 60000); // 60000 ms = 1 minute, update every minute

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval)}, []);

    */

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            {currentEmission !== null && currentHour !== null && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Current Emission for Hour {currentHour}: {currentEmission} kg CO2 per kWh</h3>
                </div>
            )}

            <button className="button" onClick={toggleGraph}>
                {isGraphVisible ? 'Hide Emissions Graph' : 'Show Emissions Graph'}
            </button>

            {isGraphVisible && plotImage && (
                <div style={{ marginTop: '20px' }}>
                    <img src={plotImage} alt="Hourly Emissions Plot" style={{ width: '80%', maxWidth: '800px' }} />
                </div>
            )}
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