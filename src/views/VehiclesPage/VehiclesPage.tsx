import AddVehicle from '../../components/Vehicles/AddVehicle'
import {tokens} from '../../Theme'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import {Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme} from '@mui/material'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { Vehicle, VehicleView } from 'src/types/types'
import DeleteVehicle from '../../components/Vehicles/DeleteVehicle'
import fs from 'fs'
import Papa from 'papaparse'

const ref = collection(db, 'vehicles')

/*const mockVehicles = [
    { id: '1', license: 'ABC123', make: 'Toyota', model: 'Corolla', year: '2020', color: 'Red' },
    { id: '2', license: 'XYZ456', make: 'Honda', model: 'Civic', year: '2021', color: 'Blue' },
    { id: '3', license: 'LMN789', make: 'Ford', model: 'Focus', year: '2019', color: 'Black' },
    { id: '4', license: 'DEF234', make: 'Chevrolet', model: 'Malibu', year: '2022', color: 'White' },
    { id: '5', license: 'GHI567', make: 'Tesla', model: 'Model 3', year: '2023', color: 'Silver' },
]*/

const VehiclesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)


    const getVehicles = async () => {
        const uid = getAuth().currentUser?.uid;
        if(uid){
            try{
                const vehicleQuery = query(ref, where('user_id', '==', uid))
                const querySnapshot = await getDocs(vehicleQuery)
                const vehicles: Vehicle[] = querySnapshot.docs.map(doc => {
                    const data = doc.data()
                    return{
                        id: doc.id,
                        license: data.license,
                        make: data.make,
                        model: data.model,
                        year: data.year,
                        color: data.color
                    }
                })
                setVehicles(vehicles)
            } catch(error){
                console.log("Error retrieving vehicles: ", error);
            }
        } else {
            console.error("User not autheticated");
        }
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleDelete = (vehicleId: string) => {
        setVehicleToDelete(vehicleId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setVehicleToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleDeleteSuccess = () => {
        getVehicles();
        setVehicleToDelete(null);
    };

    

    useEffect(() => {
        getVehicles()
    }, [])

    return (
        <Box sx={{ padding: '20px', textAlign: 'center' }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
                <Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
                    Manage Your Vehicles
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        color: colors.grey[100],
                        backgroundColor: colors.accent[400],
                        fontWeight: 'bold', 
                        '&:hover': { backgroundColor: colors.accent[500], }
                    }}
                    onClick={openModal}
                >
                    Add Vehicle
                </Button>
            </Box>

            {/* Add Vehicle Modal */}
            {isModalOpen && (
                <AddVehicle
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}

            {/* Vehicles Table */}
            <Table sx={{ marginTop: '30px', width: '100%', border: `3px solid ${colors.accent[400]}` }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: colors.grey[100] }}>License</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: colors.grey[100] }}>Make</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: colors.grey[100] }}>Model</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: colors.grey[100] }}>Year</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: colors.grey[100] }}>Color</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: colors.grey[100] }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vehicles.map(vehicle => (
                        <TableRow key={vehicle.id}>
                            <TableCell>{vehicle.license}</TableCell>
                            <TableCell>{vehicle.make}</TableCell>
                            <TableCell>{vehicle.model}</TableCell>
                            <TableCell>{vehicle.year}</TableCell>
                            <TableCell>{vehicle.color}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDelete(vehicle.id)}
                                    sx={{
                                        borderColor: colors.accent[400],
                                        color: colors.grey[100],
                                        '&:hover': { borderColor: colors.grey[500], color: colors.grey[500] }
                                    }}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Delete Vehicle Modal */}
            {vehicleToDelete && (
                <DeleteVehicle
                    isOpen={isDeleteModalOpen}
                    vehicleId={vehicleToDelete}
                    onClose={closeDeleteModal}
                    onDelete={handleDeleteSuccess}
                />
            )}
        </Box>
    )
}

export default VehiclesPage;