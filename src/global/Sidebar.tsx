import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"; 

interface SideBarProps {
    initialSelected?: string;
}

function SideBar({ initialSelected = "Home" }: SideBarProps) {
    const theme = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState(initialSelected);

    const userName = "Guest User";

    return (
        <Box
            sx={{
                height: "100vh",
                "& .pro-sidebar-inner": {
                    background: theme.palette.primary.main,
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
                    {/* Toggle Collapse Icon */}
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
                            <Typography
                                variant="h6"
                                color="white"
                                fontWeight="bold"
                            >
                                {userName}
                            </Typography>
                        </Box>
                    )}

                    {/* Dummy Menu Item */}
                    <MenuItem
                        active={selected === "Home"}
                        onClick={() => setSelected("Home")}
                        icon={<HomeOutlinedIcon />}
                        style={{ color: theme.palette.common.white }}
                    >
                        <Typography>Home</Typography>
                    </MenuItem>
                </Menu>
            </ProSidebar>
        </Box>
    );
}

export default SideBar;

