import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

    const location = useLocation(); // Get the current location (URL)

    // Hide the sidebar on the login page
    const showSidebar = location.pathname !== "/login";

    //Tracks sidebar state, collapsed or open
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
                                isCollapsed={isSidebarCollapsed}
                                setIsCollapsed={setIsSidebarCollapsed}
                            />
                        )}

                        <Box
                            sx={{
                                flexGrow: 1,
                                paddingLeft: showSidebar
                                    ? isSidebarCollapsed
                                        ? "80px" //Collapsed sidebar width
                                        : "270px" //Open sidebar width
                                    : "0px", //No sidebar
                                transition: "padding-left 0.3s",
                                overflow: "auto",
                            }}
                        >
                            {/* Main */}
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