import AddVehicle from '../../components/Vehicles/AddVehicle'
import {tokens} from '../../Theme'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../../../firebase'
import {Button, useTheme} from '@mui/material'
import { useState } from 'react'
import { getAuth } from 'firebase/auth'

const ref = collection(db, 'vehicles')

const VehiclesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(true)
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const getVehicles = async () => {
        const uid = getAuth().currentUser?.uid;
        if(uid){
            const querySnapshot = await getDocs(ref)
            const vehicles = querySnapshot.docs.map(doc => {
                const data = doc.data()
                return{
                    id: doc.id,
                    license: data.license,
                    make: data.make,
                    model: data.model,
                    year: data.year,
                    color: data.color
                }
            });
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
        </div>
    )
}

export default VehiclesPage;