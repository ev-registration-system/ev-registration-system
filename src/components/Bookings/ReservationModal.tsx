import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { tokens } from '../../Theme';
import { calculateDynamicPrice } from '../../utils/calculateDynamicPrice';
import { addBooking } from '../../utils/addBooking';
import { getUserId } from '../../utils/getUserId';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

dayjs.extend(utc);

// Generate time slots (every 30 minutes for now, this can be easily changed)
const generateTimeSlots = () => {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
        times.push(`${hour.toString().padStart(2, '0')}:00`);
        times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return times;
};

const timeOptions = generateTimeSlots();

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
    const [dynamicPrice, setDynamicPrice] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD')); 
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    //This useEffect is used to update/display the estimated price
    useEffect(() => {
        const calculatePrice = async () => {
            if (!startTime || !endTime) return;

            const formattedStartTime = dayjs(`${selectedDate} ${startTime}`).utc().toISOString();
            const formattedEndTime = dayjs(`${selectedDate} ${endTime}`).utc().toISOString();

            if (dayjs(formattedStartTime).isAfter(dayjs(formattedEndTime))) {
                console.error("Start time must be before end time!");
                return;
            }

            const price = await calculateDynamicPrice(formattedStartTime, formattedEndTime);
            setDynamicPrice(price);
        };

        calculatePrice();
    }, [startTime, endTime, selectedDate]);

    const handleTimeChange = async () => {
        if (!startTime || !endTime) return;
    
        //Combines date with time
        const formattedStartTime = dayjs(`${selectedDate} ${startTime}`).utc().toISOString();
        const formattedEndTime = dayjs(`${selectedDate} ${endTime}`).utc().toISOString();
    
        //Ensures that the start time is before end time
        if (dayjs(formattedStartTime).isAfter(dayjs(formattedEndTime))) {
            console.error("Start time must be before end time!");
            return;
        }
    
        const price = await calculateDynamicPrice(formattedStartTime, formattedEndTime);
        setDynamicPrice(price);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDate && startTime && endTime) {
            const userId = getUserId();
            if (!userId) {
                console.error("Error: User is not authenticated.");
                return;
            }

            //Combines date with time
            const formattedStartTime = dayjs(`${selectedDate} ${startTime}`).utc().toISOString();
            const formattedEndTime = dayjs(`${selectedDate} ${endTime}`).utc().toISOString();

            await addBooking(formattedStartTime, formattedEndTime, userId);
            onClose();
        } else {
            console.error("All fields are required.");
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: colors.grey[900],
                        borderRadius: '8px',
                        padding: '20px',
                    },
                }
            }}
        >
            <DialogTitle sx={{ color: colors.grey[100], textAlign: 'center' }}>
                Make a Reservation
            </DialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit}>
                    {/* Date Picker */}
                    <Box mb={2}>
                        <Typography variant="h6" color={colors.grey[100]} fontWeight="bold">
                            Select Date:
                        </Typography>
                        <TextField
                            type="date"
                            fullWidth
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            sx={{
                                backgroundColor: colors.grey[900],
                                color: colors.grey[100],
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.grey[500],
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.accent[500],
                                },
                            }}
                        />
                    </Box>

                    {/* Start Time */}
                    <Box mb={2}>
                        <Typography variant="h6" color={colors.grey[100]} fontWeight="bold">
                            Start Time:
                        </Typography>
                        <Select
                            fullWidth
                            value={startTime}
                            onChange={(e) => {
                                setStartTime(e.target.value);
                                handleTimeChange();
                            }}
                            displayEmpty
                            MenuProps={{ disablePortal: false }}
                            sx={{
                                backgroundColor: colors.grey[900],
                                color: colors.grey[100],
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.grey[500],
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.accent[500],
                                },
                            }}
                        >
                            <MenuItem value="" disabled>Select Start Time</MenuItem>
                            {timeOptions.map((time) => (
                                <MenuItem key={time} value={time}>
                                    {time}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    {/* End Time */}
                    <Box mb={2}>
                        <Typography variant="h6" color={colors.grey[100]} fontWeight="bold">
                            End Time:
                        </Typography>
                        <Select
                            fullWidth
                            value={endTime}
                            onChange={(e) => {
                                setEndTime(e.target.value);
                                handleTimeChange();
                            }}
                            displayEmpty
                            MenuProps={{ disablePortal: false }}
                            sx={{
                                backgroundColor: colors.grey[900],
                                color: colors.grey[100],
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.grey[500],
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.accent[500],
                                },
                            }}
                        >
                            <MenuItem value="" disabled>Select End Time</MenuItem>
                            {timeOptions.map((time) => (
                                <MenuItem key={time} value={time}>
                                    {time}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    {dynamicPrice !== null && (
                        <Typography 
                            variant="h5" 
                            fontWeight="bold" 
                            color={colors.grey[100]}
                            mb={2}
                            textAlign="center"
                        >
                            Estimated Price: ${dynamicPrice.toFixed(2)}
                        </Typography>
                    )}
                </form>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: colors.accent[500],
                        '&:hover': { backgroundColor: colors.accent[600] },
                    }}
                >
                    Submit
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
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReservationModal;