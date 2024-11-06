import Calendar from '../../components/Bookings/Calendar';
import Button from '../../components/Bookings/Button';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';

const BookingPage = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth); // Logs the user out
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the EV Registration System</h1>
            <Button onClick={handleLogout}>
                Logout
            </Button>
            <Calendar />
        </div>
    );
};

export default BookingPage