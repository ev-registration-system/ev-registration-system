import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../Theme";
import { useNavigate } from 'react-router-dom';
import BookingPage from '../../views/BookingPage/BookingPage';

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login');
    };

    return (
        <Box m="20px">
            {/* Header */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb="20px"
            >
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={colors.grey[100]}
                >
                    Welcome to the Booking Dashboard
                </Typography>
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
                    onClick={handleLogout}
                >
                    Log Out
                </Button>
            </Box>

            {/* Booking Calendar */}
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                    backgroundColor: colors.primary[400],
                    padding: 2,
                    borderRadius: 2,
                }}
            >
                <BookingPage /> 
            </Box>
        </Box>
    );
};

export default Dashboard;




