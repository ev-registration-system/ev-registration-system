import React from 'react';
import { db } from '../../../firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Typography,
    useTheme
} from '@mui/material';
import { tokens } from '../../Theme';

// Define the props for the DeleteBooking function
interface DeleteBookingProps { 
    isOpen: boolean; // Check if modal is open or close
    onClose: () => void; // Function to close the modal
    bookingId: string | null; // ID of the booking to be deleted (NULL if none selected)
    onDelete: () => void; // Function to refresh bookings after deletion
}

// Function to delete bookings 
const DeleteBooking: React.FC<DeleteBookingProps> = ({ isOpen, onClose, bookingId, onDelete }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const handleDelete = async () => {
        if (bookingId) { // Only proceed if a bookingId is provided
            const bookingRef = doc(collection(db, 'bookings'), bookingId); // Reference to the booking document in Firestore DB
            try {
                await deleteDoc(bookingRef); // Delete the doc from Firestone
                console.log("Booking " + bookingId + " deleted"); 
                onDelete(); // Call function to refresh bookings after deletion
            } catch (error) {
                console.error("Error deleting booking: ", error);
            }
        } else {
            console.log("No booking ID provided.");
        }
        onClose(); 
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: colors.grey[900],
                        borderRadius: '8px',
                        padding: '20px',
                        textAlign: 'center',
                    },
                }
            }}
        >
            <DialogContent>
                <Typography variant="h6" color={colors.grey[100]} fontWeight="bold">
                    Are you sure you want to delete this reservation?
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', paddingBottom: '20px' }}>
                <Button
                    onClick={handleDelete}
                    variant="contained"
                    sx={{
                        backgroundColor: colors.accent[500],
                        '&:hover': { backgroundColor: colors.accent[600] },
                    }}
                >
                    Yes
                </Button>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        color: colors.accent[500],
                        borderColor: colors.accent[500],
                        '&:hover': { borderColor: colors.accent[600], color: colors.accent[600] },
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteBooking;