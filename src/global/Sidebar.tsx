import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"; 
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventIcon from "@mui/icons-material/Event";
import CarIcon from "@mui/icons-material/DirectionsCar";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore"; 

interface SideBarProps {
    initialSelected?: string;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

function Sidebar({ initialSelected = "Home", isCollapsed, setIsCollapsed }: SideBarProps) {
    const theme = useTheme();
    const navigate = useNavigate();
    const [selected, setSelected] = useState(initialSelected);
    const [userName, setUserName] = useState("Guest User");
    const [userRole, setUserRole] = useState("Loading...");
    
    useEffect(() => {
        const auth = getAuth();
        const currentUser = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserName(user.displayName || "User");

                // Fetch role from Firestore
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setUserRole(userSnap.data().role || "User");
                } else {
                    setUserRole("User"); // Default role if not found
                }
            } else {
                setUserName("Guest User");
                setUserRole("Not Logged In");
            }
        });

        return () => currentUser();
    }, []);

    const handleNavigation = (route: string) => {
        setSelected(route);  // Update selected state
        navigate(route);  // Navigate to the clicked page
    };

    return (
        <Box
            sx={{
                position: "fixed",
                height: "100vh",
                zIndex: 100,
                "& .pro-sidebar-inner": {
                    background: theme.palette.primary.main,
                    height: "100vh",
                },
                "& .pro-icon-wrapper": {
                    background: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                    fontSize: ".5rem",
                },
                "& .pro-inner-item:hover": {
                    color: theme.palette.secondary.main,
                },
                "& .pro-menu-item.active": {
                    color: theme.palette.secondary.light,
                },
            }}
        >
            <ProSidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{
                            margin: "10px 0 20px 0",
                            color: theme.palette.common.white,
                        }}
                    >
                        {!isCollapsed && (
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="h4" fontWeight="bold">
                                    {userName}
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="bold" color="lightgray">
                                    {/* This capitalizes the first letter of the user role*/}
                                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {/* Home Page*/}
                    <MenuItem
                        active={selected === "Home"}
                        onClick={() => handleNavigation("/")}
                        icon={<HomeOutlinedIcon />}
                        style={{ color: theme.palette.common.white }}
                    >
                        <Typography>Home</Typography>
                    </MenuItem>

                    {/* Show other pages only if the user is not security */}
                    {userRole !== "security" && (
                        <>
                            {/* Bookings Page */}
                            <MenuItem
                                active={selected === ""}
                                onClick={() => handleNavigation("/bookings")} 
                                icon={<EventIcon />}
                                style={{ color: theme.palette.common.white }}
                            >
                                <Typography>Bookings</Typography>
                            </MenuItem>

                            {/* Emissions Page */}
                            <MenuItem
                                active={selected === "Home"}
                                onClick={() => handleNavigation("/emissions")}
                                icon={<TrendingUpIcon />}
                                style={{ color: theme.palette.common.white }}
                            >
                                <Typography>Emissions</Typography>
                            </MenuItem>

                            {/* Vehicles Page */}
                            <MenuItem
                                active={selected === "Home"}
                                onClick={() => handleNavigation("/vehicles")}
                                icon={<CarIcon />}
                                style={{ color: theme.palette.common.white }}
                            >
                                <Typography>Vehicles</Typography>
                            </MenuItem>
                        </>
                    )}
                </Menu>
            </ProSidebar>
        </Box>
    );
}

export default Sidebar;