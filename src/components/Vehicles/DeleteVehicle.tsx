import { getAuth } from 'firebase/auth';
import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';

interface DeleteBookingProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleId: string | null;
    onDelete: () => void;
}

const DeleteVehicle: React.FC<DeleteBookingProps> = ({isOpen, onClose, vehicleId, onDelete}) => {
   
    const [inputVehicleId, setInputVehicleId] = useState(vehicleId || '');
    
    useEffect(() => {
        setInputVehicleId(vehicleId || '');
    }, [vehicleId]);
    
    const handleDelete = async () => {    
        const uid = getAuth().currentUser?.uid
        if(inputVehicleId  && uid) {
            try{
                //trigger delete function
                const idToken = await getAuth().currentUser?.getIdToken(true);
                const data = {
                    vehicle_id: inputVehicleId,
                };
                const response = await fetch('http://127.0.0.1:5001/ev-registration-system/us-central1/deleteVehicle', {
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
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            appElement={document.getElementById('root') || undefined}
            ariaHideApp={true}
            style={{
                content: {
                    width: '300px',
                    height: '150px',
                    margin: 'auto',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(5px)`'
                },
            }}
        >
            <p>Are you sure you want to delete this vehicle?</p>
            <div>
                <button onClick={handleDelete} style={{marginRight: '10px'}}>Yes</button>
                <button onClick={onClose}>Cancel</button>
            </div>

        </Modal>
    );
};

export default DeleteVehicle