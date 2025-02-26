import { Dialog, colors, DialogContent, Typography, DialogActions, Button, useTheme } from '@mui/material';
import React, {useEffect, useState} from 'react';
import { tokens } from '../../Theme';
import { getUserId } from '../../utils/getUserId';
import { getAuthToken } from '../../utils/getAuthToken';

interface DeleteBookingProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleId: string | null;
    onDelete: () => void;
}

const DeleteVehicle: React.FC<DeleteBookingProps> = ({isOpen, onClose, vehicleId, onDelete}) => {
   
    const [inputVehicleId, setInputVehicleId] = useState(vehicleId || '');
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    useEffect(() => {
        setInputVehicleId(vehicleId || '');
    }, [vehicleId]);
    
    const handleDelete = async () => {    
        const uid = getUserId();
        if(inputVehicleId  && uid) {
            try{
                //trigger delete function
                const idToken = getAuthToken();
                const data = {
                    vehicle_id: inputVehicleId,
                };
                const BASE_URL =
                import.meta.env.MODE === "development"
                    ? "http://127.0.0.1:5001/ev-registration-system/us-central1/deleteVehicle"
                    : "https://deletevehicle-w2ytv3mava-uc.a.run.app";

                const response = await fetch(BASE_URL, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`,
                    },
                body: JSON.stringify(data),
            });
                console.log("Vehicle " + inputVehicleId  + " successfully deleted" + " " + response);
                onDelete();
            } catch (error) {
                console.error("Error deleting vehicle: ", error);
            }
        } else {
            console.log("No vehicle ID provided");
        }
        onClose();
    };
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: colors.grey[900],
                        borderRadius: '8px',
                        padding: '20px',
                        textAlign: 'center',
                    },
                }
            }}
        >
            <DialogContent>
                <Typography variant="h6" color={colors.grey[100]} fontWeight="bold">
                    Are you sure you want to delete this vehicle?
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', paddingBottom: '20px' }}>
                <Button
                    onClick={handleDelete}
                    variant="contained"
                    sx={{
                        backgroundColor: colors.accent[500],
                        '&:hover': { backgroundColor: colors.accent[600] },
                    }}
                >
                    Yes
                </Button>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        color: colors.accent[500],
                        borderColor: colors.accent[500],
                        '&:hover': { borderColor: colors.accent[600], color: colors.accent[600] },
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteVehicle