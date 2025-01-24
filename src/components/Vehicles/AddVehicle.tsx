import { getAuth } from 'firebase/auth';
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
                    console.log("Called the cloud function")
                    if(response.ok){
                        const result = await response.json();
                        console.log("Vehicle Added Successfully!", result);
                    } else {
                        const error = await response.json();
                        console.error("Error adding vehicle: ", error.error);
                    }
                    onClose();
                } else {
                    console.error("User is not authenticated");
                }
            } catch (error){
                console.error("Error Calling AddVehicle Cloudfunction: ", error);
            }
        } else {
            console.error("All Field are required");
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