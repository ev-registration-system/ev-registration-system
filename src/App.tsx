import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingPage from './views/BookingPage/BookingPage';
import LoginPage from './views/LoginPage/LoginPage';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import AppLayout from './components/AppLayout/AppLayout';
import { AuthProvider } from './state/AuthProvider/AuthProvider';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Protected routes wrapper */}
                    <Route element={<ProtectedRoutes />}>
                        {/* App layout wrapper */}
                        <Route path="/" element={<AppLayout />}>
                            <Route index element={<BookingPage />} />
                        </Route>
                    </Route>
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
