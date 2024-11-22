import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './views/LoginPage/LoginPage';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import { AuthProvider } from './state/AuthProvider/AuthProvider';
import Sidebar from "./global/Sidebar";
import { Theme, ThemeProvider } from "@emotion/react";
import { ColorModeContext, useMode } from "./Theme";
import { CssBaseline, Box } from "@mui/material";
import Dashboard from "./views/dashboard/Dashboard";
import { useState } from 'react';

const App: React.FC = () => {
    const [theme, colorMode] = useMode() as [
        Theme,
        { toggleColorMode: () => void }
    ];

    const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar state
    const location = useLocation(); // Get the current location (URL)

    // Hide the sidebar on the login page
    const showSidebar = location.pathname !== "/login";

    return (
        <AuthProvider>
            <ColorModeContext.Provider value={{ toggleColorMode: colorMode.toggleColorMode }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Box display="flex">
                        {/* Sidebar */}
                        {showSidebar && (
                            <Sidebar
                                initialSelected="Home"
                                isCollapsed={!isSidebarOpen}
                                onToggleCollapse={() => setSidebarOpen(!isSidebarOpen)}
                            />
                        )}

                        <Box
                            sx={{
                                flexGrow: 1,
                                paddingLeft: showSidebar && isSidebarOpen ? "270px" : "80px", // Adjust content padding based on sidebar visibility
                                transition: "padding-left 0.3s",
                                overflow: "auto",
                            }}
                        >
                            {/* Main content area */}
                            <main className="content">
                                <Routes>
                                    <Route path="/login" element={<LoginPage />} />
                                    
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
