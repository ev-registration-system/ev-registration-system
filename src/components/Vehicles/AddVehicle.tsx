import { getAuth } from 'firebase/auth';
import React, {useState} from 'react';
import Modal from 'react-modal';
import { Box, Button, TextField, Typography, useTheme } from '@mui/material'
import { tokens } from '../../Theme'


interface AddVehicleProps{
    isOpen: boolean;
    onClose: () => void;
}

const AddVehicle: React.FC<AddVehicleProps> = ({isOpen, onClose}) => {
    const [vehcicleLicense, setVehicleLicense] = useState('');
    // const [vehicleUser, setVehicleUser] = useState('');
    const [vehicleMake, setVehicleMake] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleYear, setVehicleYear] = useState('');
    const [vehicleColor, setVehicleColor] = useState('');
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    
    //getAuth().currentUser
    
    const handleVehicle = async(e: React.FormEvent) => {
        e.preventDefault();
        if(vehcicleLicense && vehicleMake && vehicleModel && vehicleYear && vehicleColor){
            try{
                const uid = getAuth().currentUser?.uid
                if(uid){
                    console.log("Found uid");
                    const idToken = await getAuth().currentUser?.getIdToken(true);
                    console.log("license: " + vehcicleLicense);
                    const data = {
                        license: vehcicleLicense,
                        user_id: uid,
                        make: vehicleMake,
                        model: vehicleModel,
                        year: vehicleYear,
                        color: vehicleColor
                    };
                    console.log(data);
                    console.log("Created data")
                    //add the right url
                    const response = await fetch('http://127.0.0.1:5001/ev-registration-system/us-central1/addVehicle', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${idToken}`,
                        },
                        body: JSON.stringify(data),
                    });
                    if(response.ok){
                        onClose();
                        const result = await response.json();
                        console.log("Vehicle Added Successfully!", result);
                    } else {
                        const error = await response.json();
                        console.error("Error adding vehicle: ", error.error);
                    }
                } else {
                    console.error("User is not authenticated");
                }
            } catch (error){
                console.error("Error Calling AddVehicle Cloudfunction: ", error);
            }
        } else {
            console.error("All Field are required");
        }
        onClose()
    };
    return (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={{
            overlay: { zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.5)' },
            content: {
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '500px',
              width: '90%',
              height: '500px',
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: colors.grey[900],
              zIndex: 2001,
            },
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color={colors.grey[100]} mb={2}>
              Add a Vehicle
            </Typography>
    
            <form onSubmit={handleVehicle}>
              <Box mb={2}>
                <TextField
                  label="Vehicle License Plate"
                  variant="outlined"
                  fullWidth
                  value={vehcicleLicense}
                  onChange={(e) => setVehicleLicense(e.target.value)}
                  required
                  sx={{
                    backgroundColor: colors.grey[900],
                    '& .MuiInputBase-root': {
                      color: colors.grey[100],
                    },
                  }}
                />
              </Box>
    
              <Box mb={2}>
                <TextField
                  label="Vehicle Make"
                  variant="outlined"
                  fullWidth
                  value={vehicleMake}
                  onChange={(e) => setVehicleMake(e.target.value)}
                  required
                  sx={{
                    backgroundColor: colors.grey[900],
                    '& .MuiInputBase-root': {
                      color: colors.grey[100],
                    },
                  }}
                />
              </Box>
    
              <Box mb={2}>
                <TextField
                  label="Vehicle Model"
                  variant="outlined"
                  fullWidth
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  required
                  sx={{
                    backgroundColor: colors.grey[900],
                    '& .MuiInputBase-root': {
                      color: colors.grey[100],
                    },
                  }}
                />
              </Box>
    
              <Box mb={2}>
                <TextField
                  label="Vehicle Year"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(e.target.value)}
                  required
                  sx={{
                    backgroundColor: colors.grey[900],
                    '& .MuiInputBase-root': {
                      color: colors.grey[100],
                    },
                  }}
                />
              </Box>
    
              <Box mb={3}>
                <TextField
                  label="Vehicle Color"
                  variant="outlined"
                  fullWidth
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  required
                  sx={{
                    backgroundColor: colors.grey[900],
                    '& .MuiInputBase-root': {
                      color: colors.grey[100],
                    },
                  }}
                />
              </Box>
    
              <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: colors.accent[500],
                    '&:hover': { backgroundColor: colors.accent[600] },
                  }}
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={onClose}
                  sx={{
                    color: colors.accent[500],
                    borderColor: colors.accent[500],
                    '&:hover': { borderColor: colors.accent[600], color: colors.accent[600] },
                  }}
                >
                  Close
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      )
}

export default AddVehicle;