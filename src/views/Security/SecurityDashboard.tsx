import React from "react";
import { Box, Typography } from "@mui/material";

const SecurityDashboard: React.FC = () => {
    return (
        <Box p={3}>
            <Typography variant="h4" fontWeight="bold">
                Security Dashboard
            </Typography>
            <Typography>
                Welcome, security officer!
            </Typography>
        </Box>
    );
};

export default SecurityDashboard;