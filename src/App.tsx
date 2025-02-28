import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './views/LoginPage/LoginPage';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import { AuthProvider } from './state/AuthProvider/AuthProvider';
import Sidebar from "./global/Sidebar";
import Topbar from "./global/Topbar"
import { Theme, ThemeProvider } from "@emotion/react";
import { ColorModeContext, useMode } from "./Theme";
import { CssBaseline, Box } from "@mui/material";
import Dashboard from "./views/dashboard/Dashboard";
import BookingPage from "./views/BookingPage/BookingPage";
import EmissionsPage from "./views/EmissionsPage/EmissionsPage";
import VehiclesPage from "./views/VehiclesPage/VehiclesPage";
import SecurityDashboard from "./views/Security/SecurityDashboard";
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const App: React.FC = () => {
    const [theme, colorMode] = useMode() as [
        Theme,
        { toggleColorMode: () => void }
    ];

    const location = useLocation(); //Get the current location (URL)

    //Hide the sidebar on the login page
    const showSidebar = location.pathname !== "/login";
    const showTopbar = location.pathname !== "/login";

    //Tracks Role
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    //Tracks sidebar state, collapsed or open
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Fetch user role when logged in
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role || "user"); //Default to "user" if no role
                } else {
                    setUserRole("user"); 
                }
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthProvider>
            <ColorModeContext.Provider value={{ toggleColorMode: colorMode.toggleColorMode }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Box display="flex" flexDirection="column" height="100vh">
                        {/* TopBar */}
                        {showTopbar && <Topbar isSidebarCollapsed={isSidebarCollapsed}/>}
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

                                    <Route element={<ProtectedRoutes />}>
                                        {userRole === "security" ? (
                                            <>
                                                <Route path="/dashboard" element={<SecurityDashboard />} />
                                                <Route path="/" element={<SecurityDashboard />} />
                                            </>
                                        ) : (
                                            <>
                                                <Route path="/dashboard" element={<Dashboard />} />
                                                <Route path="/" element={<Dashboard />} />
                                                <Route path="/bookings" element={<BookingPage />} />
                                                <Route path="/emissions" element={<EmissionsPage />} />
                                                <Route path="/vehicles" element={<VehiclesPage />} />
                                            </>
                                        )}
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
}

export default App;