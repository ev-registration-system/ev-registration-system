import { useState } from 'react';
import Modal from 'react-modal';
import { Box, Button, TextField, Typography, useTheme } from '@mui/material';
import { tokens } from '../../Theme';
import { calculateDynamicPrice } from '../../utils/calculateDynamicPrice';
import { addBooking } from '../../utils/addBooking';
import { getUserId } from '../../utils/getUserId';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
    const [dynamicPrice, setDynamicPrice] = useState<number | null>(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleTimeChange = async () => {
        if (startTime && endTime) {
            const price = await calculateDynamicPrice(startTime, endTime);
            setDynamicPrice(price);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (startTime && endTime) {
            const userId = getUserId();
            if (!userId) {
                console.error("Error: User is not authenticated.");
                return;
            }
            await addBooking(startTime, endTime, userId);
            onClose();
        } else {
            console.error("Start time and end time are required.");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: { zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.5)' },
                content: {
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '500px',
                    width: '90%',
                    height: '500px',
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor: colors.grey[900],
                    zIndex: 2001,
                },
            }}
        >
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color={colors.grey[100]} mb={2}>
                    Make a Reservation
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            label="Start Time"
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            value={startTime}
                            onChange={(e) => {
                                setStartTime(e.target.value);
                                handleTimeChange();
                            }}
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                backgroundColor: colors.grey[900],
                                '& .MuiInputBase-root': {
                                    color: colors.grey[100],
                                },
                            }}
                        />
                    </Box>

                    <Box mb={2}>
                        <TextField
                            label="End Time"
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            value={endTime}
                            onChange={(e) => {
                                setEndTime(e.target.value);
                                handleTimeChange();
                            }}
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                backgroundColor: colors.grey[900],
                                '& .MuiInputBase-root': {
                                    color: colors.grey[100],
                                },
                            }}
                        />
                    </Box>

                    {dynamicPrice !== null && (
                        <Typography 
                            variant="h5" 
                            fontWeight="bold" 
                            color={colors.grey[100]}
                            mb={2}
                        >
                            Estimated Price: ${dynamicPrice.toFixed(2)}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: colors.accent[500],
                                '&:hover': { backgroundColor: colors.accent[600] },
                            }}
                        >
                            Submit
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={onClose}
                            sx={{
                                color: colors.accent[500],
                                borderColor: colors.accent[500],
                                '&:hover': { borderColor: colors.accent[600], color: colors.accent[600] },
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default ReservationModal;