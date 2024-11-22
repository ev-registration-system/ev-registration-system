import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './views/LoginPage/LoginPage';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import { AuthProvider } from './state/AuthProvider/AuthProvider';
import Sidebar from "./global/Sidebar";
import { Theme, ThemeProvider } from "@emotion/react";
import { ColorModeContext, useMode } from "./Theme";
import { CssBaseline } from "@mui/material";
import Dashboard from "./views/dashboard/Dashboard";


const App: React.FC = () => {

    const [theme, colorMode] = useMode() as [
        Theme,
        { toggleColorMode: () => void }
    ];

    return (
        <Router>
            <AuthProvider>
                <ColorModeContext.Provider value={{ toggleColorMode: colorMode.toggleColorMode }}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            
                            {/* Protected routes wrapper */}
                            <Route element={<ProtectedRoutes />}>
                                <div className="sidebar">
                                    {/* Global Sidebar */}
                                    <Sidebar initialSelected="Home" />
                                </div>
                                <main className="content">
                                    <Routes>
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        <Route path="/" element={<Dashboard />} />
                                    </Routes>
                                </main>
                            </Route>
                            {/* Catch-all route */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </ThemeProvider>
                </ColorModeContext.Provider>                
            </AuthProvider>
        </Router>
    );
};

export default App;
