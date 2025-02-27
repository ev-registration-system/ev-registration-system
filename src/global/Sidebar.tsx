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
import { getAuth } from "firebase/auth"; 

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
    
    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUserName(auth.currentUser.displayName || "Guest User");
        }
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
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" fontWeight="bold">
                                    {userName}
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
                </Menu>
            </ProSidebar>
        </Box>
    );
}

export default Sidebar;