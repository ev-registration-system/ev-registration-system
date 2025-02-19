import { getAuth } from 'firebase/auth';
import React, {useEffect, useRef, useState} from 'react';
import Modal from 'react-modal';
import { Box, Button, MenuItem, Select, TextField, Typography, useTheme } from '@mui/material'
import { tokens } from '../../Theme'
import { VehicleView } from 'src/types/types';
import Papa from 'papaparse';
import { Label, Menu } from '@mui/icons-material';


interface AddVehicleProps{
    isOpen: boolean;
    onClose: () => void;
}

const AddVehicle: React.FC<AddVehicleProps> = ({isOpen, onClose}) => {
    const [vehcicleLicense, setVehicleLicense] = useState('');
    const [vehicleMake, setVehicleMake] = useState("");
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleYear, setVehicleYear] = useState('');
    const [vehicleColor, setVehicleColor] = useState('');
    const [makes, setMakes] = useState<string[]>([]);
    const [filteredModels, setFilteredModels] = useState<string[]>([]);
    const [vehiclesDeclared, setVehiclesDeclared] = useState<VehicleView[]>([])
    const dialogRef = useRef<HTMLDialogElement | null>(null)
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const loadCSV = async (): Promise<VehicleView[]> => {
            try{
                const response = await fetch('/ElectricVehicles.csv');
                const csvData = await response.text()
                return new Promise((resolve, reject) => {
                    Papa.parse<VehicleView>(csvData, {
                        header: true,
                        skipEmptyLines: true,
                        delimiter: ',',
                        dynamicTyping:true,
                        complete: (result) => {
                            const data = result.data as  VehicleView[]
                            setVehiclesDeclared(data)
    
                            const uniqueMakes = Array.from(
                                new Set(
                                  data
                                    .filter((item) => item.Make) // Remove rows without a Make field
                                    .map((item) => item.Make.trim()) // Clean up whitespace
                                )
                              );                        
                              setMakes(uniqueMakes);
    
                        },
                        error: (error: any) => {
                            reject(error);
                        },
                    });
                });
            } catch (error) {
                console.error('Error reading or pasing the CSV file:', error);
                throw error;
            }
        };

    //getAuth().currentUser
    
    const handleVehicle = async(e: React.FormEvent) => {
      const link =
        import.meta.env.MODE === "development"
          ? "http://127.0.0.1:5001/ev-registration-system/us-central1/addVehicle"
          : "https://addvehicle-w2ytv3mava-uc.a.run.app";
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
                    const response = await fetch(link, {
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

    useEffect(() => {
      loadCSV()
      if(isOpen){
        dialogRef.current?.showModal()
      } else {
        dialogRef.current?.close()
      }

      if(vehicleMake){
        const models = vehiclesDeclared.filter((vehicle) => vehicle.Make.trim() === vehicleMake)
        .map((vehicle) => vehicle.Model.trim());

        setFilteredModels([...new Set(models)]) 
      } else {
        setFilteredModels([]);
      }

    }, [isOpen, vehicleMake, vehiclesDeclared]);

    return (
        <dialog ref={dialogRef} className='p-4 rounded-md shadow-lg max-w-md w-11/12 bg-gray-900 text-white'>
          <Box sx={{textAlign: 'center'}}>
            <Typography variant="h5" color={colors.grey[100]} mb={2}>
              Add a Vehicle
            </Typography>

            <form onSubmit={handleVehicle}>
            <Box mb={2}>
                <TextField label="Vehicle License Plate" variant="outlined" fullWidth type="text" value={vehcicleLicense} onChange={(e) => setVehicleLicense(e.target.value)} required />
              </Box>

              <Box mb={2}>
                <Select fullWidth value={vehicleMake || ''} onChange={(e) => setVehicleMake(e.target.value as string)} 
                displayEmpty
                MenuProps={{ disablePortal: true }}
                >
                  <MenuItem value="" disabled>
                    Select Vehicle Make
                  </MenuItem>
                  {makes.map((make) => (
                    <MenuItem key={make} value={make}>
                      {make}
                     </MenuItem>
                    ))}
                </Select>
              </Box>
              
              <Box mb={2}>
                <Select fullWidth value={vehicleModel || ''} 
                  onChange={(e) => setVehicleModel(e.target.value as string)} 
                  displayEmpty 
                  disabled={!vehicleMake} // Disable if no make selected
                  MenuProps={{ disablePortal: true }}
                >
                  <MenuItem value="" disabled>Select Vehicle Model</MenuItem>
                  {filteredModels.map((model) => (
                    <MenuItem key={model} value={model}>{model}</MenuItem>
                  ))}
                </Select>
              </Box>

              <Box mb={2}>
                <TextField label="Vehicle Year" variant="outlined" fullWidth type="number" value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} required />
              </Box>

              <Box mb={3}>
                <TextField label="Vehicle Color" variant="outlined" fullWidth value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} required />
              </Box>

              <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Button type="submit" variant="contained" onClick={handleVehicle}>
                  Submit
                </Button>
                <Button type="button" variant="outlined" onClick={onClose}>
                  Close
                </Button>
              </Box>

            </form>
          </Box>
        </dialog>
      )
}

export default AddVehicle;