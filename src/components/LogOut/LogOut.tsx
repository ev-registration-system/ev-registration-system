import { Button, useTheme } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { tokens } from '../../Theme';

interface LogoutButtonProps {
    onLogoutSuccess?: () => void;
}

const LogOut: React.FC<LogoutButtonProps> = ({ onLogoutSuccess }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth); // Logs the user out
            if (onLogoutSuccess) {
                onLogoutSuccess(); 
            }
            navigate('/login'); // Redirects user to login page
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    return (
        <Button
            variant="contained"
            sx={{
                color: colors.grey[100],
                backgroundColor: colors.primary[400],
                fontWeight: 'bold',
                '&:hover': {
                    backgroundColor: colors.grey[600],
                },
            }}
            onClick={handleLogout}
        >
            Log Out
        </Button>
    );
};

export default LogOut;
