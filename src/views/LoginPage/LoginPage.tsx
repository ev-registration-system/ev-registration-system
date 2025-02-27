import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthProvider/AuthProvider';
import { Box, Button, CircularProgress, Typography, useTheme } from '@mui/material';
import { addUser } from "../../utils/users";

function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();

    const { loginWithGoogle } = useAuth();

    // Handle Google Login
    const handleGoogleLogin = async () => {
        try {
            setLoading(true); // updates loading state
            await loginWithGoogle(); // Open Google sign-in popup
            await addUser();
            navigate('/'); // Redirect to booking page on success
        } catch (err) {
            console.error(err)
            setError('Failed to login with Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '400px',
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: theme.palette.background.paper, 
                }}
            >
                <Typography variant="h4" gutterBottom>
                    EV Registration System Login
                </Typography>

                <Button
                    variant="contained"
                    color="primary" 
                    onClick={handleGoogleLogin}
                    fullWidth
                    disabled={loading}
                    sx={{
                        padding: '10px 0',
                        marginBottom: 2,
                        '&:hover': {
                            backgroundColor: theme.palette.secondary.main, 
                        },
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login with Google'}
                </Button>

                {error && (
                    <Typography color="error" variant="body2" align="center">
                        {error}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default LoginPage;