import AddVehicle from '../../components/Vehicles/AddVehicle'
import {tokens} from '../../Theme'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import {Button, Table, TableBody, TableCell, TableHead, TableRow, useTheme} from '@mui/material'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { Vehicle } from 'src/types/types'
import DeleteVehicle from '../../components/Vehicles/DeleteVehicle'

const ref = collection(db, 'vehicles')


const VehiclesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null)
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const getVehicles = async () => {
        const uid = getAuth().currentUser?.uid;
        console.log(uid)
        if(uid){
            try{
                const vehicleQuery = query(ref, where('user_id', '==', uid))
                const querySnapshot = await getDocs(vehicleQuery)
                console.log(querySnapshot)
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
                console.log(vehicles)
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
        <div style={{textAlign: 'center', marginTop: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', margin: '20px auto' }}>
                <Button
                    variant="contained"
                    sx={{
                        color: colors.grey[100],
                        backgroundColor: colors.primary[400],
                        fontWeight: "bold",
                        '&:hover': {
                            backgroundColor: colors.accent[400]
                        },
                    }}
                    onClick={openModal}
                >
                    Add Vehicle
                </Button>
            </div>
            {isModalOpen && (
                <AddVehicle
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}

            <Table sx={{margin: '20px auto', width: '80%'}}>
                <TableHead>
                    <TableRow>
                        <TableCell>License</TableCell>
                        <TableCell>Make</TableCell>
                        <TableCell>Model</TableCell>
                        <TableCell>Year</TableCell>
                        <TableCell>Color</TableCell>
                        <TableCell>Actions</TableCell>
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
                            <TableCell><Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDelete(vehicle.id)}
                                >
                                    Delete
                                </Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {vehicleToDelete && (
                <DeleteVehicle
                    isOpen={isDeleteModalOpen}
                    vehicleId={vehicleToDelete}
                    onClose={closeDeleteModal}
                    onDelete={handleDeleteSuccess}
                />
            )}
        </div>
    )
}

export default VehiclesPage;