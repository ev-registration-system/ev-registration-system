import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"; 
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

interface SideBarProps {
    initialSelected?: string;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

function Sidebar({ initialSelected = "Home", isCollapsed, setIsCollapsed }: SideBarProps) {
    const theme = useTheme();
    const [selected, setSelected] = useState(initialSelected);

    const userName = "Guest User";

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
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h5" color="white">
                                    Dashboard
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {/* User Info */}
                    {!isCollapsed && (
                        <Box
                            mb="25px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                        >
                            <Typography variant="h6" color="white" fontWeight="bold">
                                {userName}
                            </Typography>
                        </Box>
                    )}

                    {/* Home Page*/}
                    <MenuItem
                        active={selected === "Home"}
                        onClick={() => setSelected("Home")}
                        icon={<HomeOutlinedIcon />}
                        style={{ color: theme.palette.common.white }}
                    >
                        <Typography>Home</Typography>
                    </MenuItem>

                    {/* Emissions Page */}
                    <MenuItem
                        active={selected === "Home"}
                        onClick={() => setSelected("Home")}
                        icon={<TrendingUpIcon />}
                        style={{ color: theme.palette.common.white }}
                    >
                        <Typography>Emissions</Typography>
                    </MenuItem>
                </Menu>
            </ProSidebar>
        </Box>
    );
}

export default Sidebar;

