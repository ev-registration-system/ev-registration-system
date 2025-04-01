import AddVehicle from '../../components/Vehicles/AddVehicle'
import {tokens} from '../../Theme'
import {Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme} from '@mui/material'
import { useEffect, useState } from 'react'
import { Vehicle } from 'src/types/types'
import { getUserVehicles } from '../../utils/vehicles';
import DeleteVehicle from '../../components/Vehicles/DeleteVehicle'

const VehiclesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const fetchVehicles = async () => {
        const userVehicles = await getUserVehicles();
        setVehicles(userVehicles);
    };

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
        fetchVehicles();
        setVehicleToDelete(null);
    };

    

    useEffect(() => {
        fetchVehicles()
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