import { Box, Typography, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom'; 
import { tokens } from '../Theme'; 
import LogOut from '../components/LogOut/LogOut'; 

interface TopBarProps {
    isSidebarCollapsed: boolean; // Tracks Sidebar state
}

const Topbar: React.FC<TopBarProps> = ({ isSidebarCollapsed }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const location = useLocation();

    const getPageName = (path: string) => {
        switch (path) {
            case '/':
                return 'Dashboard';
            case '/bookings':
                return 'Bookings';
            case '/emissions':
                return 'Emissions';
            default:
                return 'Dashboard';
        }
    };

    const currentPage = getPageName(location.pathname);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 20px',
                backgroundColor: colors.accent[500],
                boxShadow: 3,
                height: '60px',
                width: '100%',
                position: 'relative',
                paddingLeft: isSidebarCollapsed ? '80px' : '270px', 
                transition: 'padding-left 0.3s ease', 
            }}
        >
            {/* Page Name */}
            <Typography
                variant="h6"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center', 
                    color: colors.primary,
                    fontWeight: 'bold',
                    fontSize: '24px',
                }}
            >
                {currentPage}
            </Typography>

            {/* Logout Button (Right) */}
            <Box sx={{ ml: 'auto' }}>
                <LogOut onLogoutSuccess={() => console.log('Logged out successfully')} />
            </Box>
        </Box>
    );
};

export default Topbar;