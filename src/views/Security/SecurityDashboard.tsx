import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { db } from "../../../firebase";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import SecurityCalendar from "../../components/Security/SecurityCalendar"; 
import { Booking } from "../../types/types"; 

const SecurityDashboard: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTodaysBookings = async () => {
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0); //Midnight

                const bookingsRef = collection(db, "bookings");
                const snapshot = await getDocs(bookingsRef);

                const fetchedBookings: Booking[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Booking[];

                //This convert Firestore Timestamp and filters today's bookings
                const todaysBookings = fetchedBookings.filter((booking) => {
                    let startTime: Date;

                    if (booking.startTime instanceof Timestamp) {
                        startTime = booking.startTime.toDate(); 
                    } else {
                        startTime = new Date(booking.startTime);
                    }

                    return startTime.toDateString() === today.toDateString(); 
                });

                setBookings(todaysBookings);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTodaysBookings();
    }, []);

    return (
        <Box p={3}>
            <Typography variant="h3" fontWeight="bold">
                Security Dashboard
            </Typography>
            <Typography variant="h6">
                Here are today's bookings.
            </Typography>

            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : (
                <Box mt={3}>
                    <SecurityCalendar bookings={bookings} />
                </Box>
            )}
        </Box>
    );
};

export default SecurityDashboard;