import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthProvider/AuthProvider';

function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { loginWithGoogle } = useAuth();

    // Handle Google Login
    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle(); // Open Google sign-in popup
            navigate('/'); // Redirect to booking page on success
        } catch (err) {
            setError('Failed to login with Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div>
                <h2>Login</h2>
                <button
                    onClick={handleGoogleLogin}
                    className=""
                    disabled={loading}
                >
                    {loading ? 'Logging in with Google...' : 'Login with Google'}
                </button>
                {error && (
                    <p className="mt-4 text-center text-red-500">{error}</p>
                )}
            </div>
        </div>
    );
}

export default LoginPage;
