import React, {useState} from 'react';
import Modal from 'react-modal';

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

    const handleVehicle = async(e: React.FormEvent) => {
        e.preventDefault();
        if(vehcicleLicense && vehicleMake && vehicleModel && vehicleYear && vehicleColor){
            try{
                //handle adding
                onClose();
            } catch (error){
                console.error("Error adding vehicle: ", error);
            }
        }
    };
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: {zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.5)'},
                content: {
                    position: 'fixed',
                    top: '50%',
                    left:'50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '500px',
                    width: '90%',
                    padding: '20px',
                    borderRadius: '8px',
                    zIndex: 2001,
                }
            }}
        >
            <div>
                <h2>Add a Vehicle</h2>
                <form onSubmit={handleVehicle}>
                    <label>
                        Vehicle License Plate:
                        <input
                            type="text"
                            value={vehcicleLicense}
                            onChange={(e) => setVehicleLicense(e.target.value)}
                            required
                        >
                        </input>
                    </label>
                    <br/><br/>
                    <label>Vehicle Make: 
                        <input
                            type="text"
                            value={vehicleMake}
                            onChange={(e) => setVehicleMake(e.target.value)}
                            required
                        >
                        </input>
                    </label>
                    <br/><br/>
                    <label>
                        Vehicle Model:
                        <input
                            type="text"
                            value={vehicleModel}
                            onChange={(e) => setVehicleModel(e.target.value)}
                            required
                        />
                    </label>
                    <br/><br/>
                    <label>
                        Vehicle Year:
                        <input
                            type="number"
                            value={vehicleYear}
                            onChange={(e) => setVehicleYear(e.target.value)}
                            required
                        />
                    </label>
                    <br/><br/>
                    <label>
                        Vehicle Color:
                        <input
                            type="text"
                            value={vehicleColor}
                            onChange={(e) => setVehicleColor(e.target.value)}
                            required
                        />
                    </label>
                    <br/><br/>
                    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px'}}>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default AddVehicle;