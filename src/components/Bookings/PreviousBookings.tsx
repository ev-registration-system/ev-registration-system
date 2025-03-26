import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { db } from "../../../firebase";
import { Timestamp } from "firebase-admin/firestore";
import { error } from "firebase-functions/logger";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react"
import { Booking } from "src/types/types";

interface PreviousBookingsProp{
    open: boolean;
    onClose: () => void;
}

const PreviousBookings: React.FC<PreviousBookingsProp> = ({open, onClose}) => {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        if(open){
            const fetchBookings = async () => {
                const uid = getAuth().currentUser?.uid
                if(!uid){
                    console.log("User not Signed In")
                    return error
                }
                const bookingsQuery = query(
                    collection(db, "bookings"),
                    where('endTime', '<', Timestamp.now()),
                    where('userId', "==", uid)
                );

                const querySnapshot = await getDocs(bookingsQuery);
                const bookingsList = querySnapshot.docs.map((doc) =>{ 
                    const data = doc.data()
                    return {
                        id: doc.id,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        userId: data.userId,
                        vehicleId: data.vehicleId,
                        checkedIn: data.checkedIn
                    } as Booking;
                });

                setBookings(bookingsList);
            }
            fetchBookings();
        }
    }, [open])

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Previous Bookings</DialogTitle>
            <DialogContent>
                {bookings.length === 0 ? (
                    <Typography>No Previous Bookings Available</Typography>
                ) : (
                    <ul>
                        {bookings.map((booking) => (
                            <li key={booking.id}>
                                Booking ID: {booking.id}
                                Start Time: {booking.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br/>
								End Time: {booking.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br/>
								Vehicle To Charge: {booking.vehicleId}
                            </li>
                        ))}
                    </ul>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PreviousBookings