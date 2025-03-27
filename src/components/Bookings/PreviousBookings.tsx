import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { db } from "../../../firebase";
import { Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react"
import { Booking, Vehicle } from "src/types/types";

interface PreviousBookingsProp{
    open: boolean;
    onClose: () => void;
}

const PreviousBookings: React.FC<PreviousBookingsProp> = ({open, onClose}) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [vehiclesData, setVehicles] = useState<Vehicle[] | null>(null)

    const handleVehicles = async () => {
        if(getAuth().currentUser?.uid){
            try{
                const q = query(collection(db, "vehicles"), where("user_id", "==", getAuth().currentUser?.uid))
                const querySnapshot = await getDocs(q)
                const vehiclesData: Vehicle[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                    return{
                        id: doc.id,
                        license: data.license,
                        make: data.make,
                        model: data.model,
                        year: data.year,
                        color: data.color
                    };
                });
                setVehicles(vehiclesData)
                console.log(vehiclesData)
            } catch(error){
                console.log(error)
            }
        }
    }
    


    useEffect(() => {
        if(open){
            const fetchBookings = async () => {
                
                if(!getAuth().currentUser?.uid){
                    console.log("User not Signed In")
                }
                const bookingsQuery = query(
                    collection(db, "bookings"),
                    where('endTime', '<', Timestamp.now()),
                    where('userId', "==", getAuth().currentUser?.uid)
                );

                const querySnapshot = await getDocs(bookingsQuery);
                const bookingsList = querySnapshot.docs.map((doc) =>{ 
                    const data = doc.data()
                    return {
                        id: doc.id,
                        startTime: (data.startTime as Timestamp).toDate(),
                        endTime: (data.endTime as Timestamp).toDate(),
                        userId: data.userId,
                        vehicleId: data.vehicleId,
                        checkedIn: data.checkedIn
                    } as Booking;
                });

                setBookings(bookingsList);
            }
            fetchBookings();
            handleVehicles();
        }
        console.log("Here too")
    }, [open])


    const mergedBookings = bookings?.map((booking) => {
		const vehicle = vehiclesData?.find((v) => v.id === booking.vehicleId);
		return {
		  ...booking,
		  vehicle,
		};
	});

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle><Typography variant="h3">Previous Bookings</Typography></DialogTitle>
            <DialogContent>
                {bookings.length === 0 ? (
                    <Typography>No Previous Bookings Available</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Booking ID</b></TableCell>
                                    <TableCell><b>Date</b></TableCell>
                                    <TableCell><b>Start Time</b></TableCell>
                                    <TableCell><b>End Time</b></TableCell>
                                    <TableCell><b>Vehicle ID</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mergedBookings.map((booking) => (
                                    <TableRow>
                                        <TableCell>{booking.id}</TableCell>
                                        <TableCell>{booking.startTime.toLocaleDateString()}</TableCell>
                                        <TableCell>{booking.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                        <TableCell>{booking.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                        <TableCell>{booking.vehicle?.make} {booking.vehicle?.model} {booking.vehicle?.license || "N/A"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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