import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './views/LoginPage/LoginPage';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import { AuthProvider } from './state/AuthProvider/AuthProvider';
import Sidebar from "./global/Sidebar";
import { Theme, ThemeProvider } from "@emotion/react";
import { ColorModeContext, useMode } from "./Theme";
import { CssBaseline, Box } from "@mui/material";
import Dashboard from "./views/dashboard/Dashboard";
import { useState } from 'react';
import { useAuth } from "./state/AuthProvider/AuthProvider"

const App: React.FC = () => {
    const [theme, colorMode] = useMode() as [
        Theme,
        { toggleColorMode: () => void }
    ];

    const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar state
    const { isAuthenticated } = useAuth(); // Assuming isAuthenticated is coming from a context

    return (
        <AuthProvider>
            <ColorModeContext.Provider value={{ toggleColorMode: colorMode.toggleColorMode }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Box display="flex">
                        {/* Sidebar */}
                        {isAuthenticated && (
                            <Sidebar
                                initialSelected="Home"
                                isCollapsed={!isSidebarOpen}
                                onToggleCollapse={() => setSidebarOpen(!isSidebarOpen)}
                            />
                        )}

                        <Box
                            sx={{
                                flexGrow: 1,
                                paddingLeft: isSidebarOpen ? "270px" : "80px",
                                transition: "padding-left 0.3s",
                                overflow: "auto",
                            }}
                        >
                            {/* Main content area */}
                            <main className="content">
                                <Routes>
                                    <Route
                                        path="/login"
                                        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
                                    />
                                    {/* Protected Routes */}
                                    <Route element={<ProtectedRoutes />}>
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        <Route path="/" element={<Dashboard />} />
                                    </Route>
                                    {/* Catch-all Route */}
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </main>
                        </Box>
                    </Box>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </AuthProvider>
    );
};

export default App;

