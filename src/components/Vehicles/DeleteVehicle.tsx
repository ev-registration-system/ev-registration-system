import React, {useState} from 'react';
import Modal from 'react-modal';

interface DeleteBookingProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleId: string | null;
    onDelete: () => void;
}

const DeleteVehicle: React.FC<DeleteBookingProps> = ({isOpen, onClose, vehicleId, onDelete}) => {
    const handleDelete = async () => {
        if(vehicleId) {
            try{
                //trigger delete function
                console.log("Vehicle " + vehicleId + " successfully deleted");
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