import { useState } from 'react';
import '../../stylings/ReservationButtons.css'
import '../../stylings/ModalStyling.css'
import Modal from 'react-modal';
import { getAuth } from 'firebase/auth';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReservationModal({onClose, isOpen}: ReservationModalProps) {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // const vehicle_dropdown = () => {
    //     const[vehicles, setVehicles] = useState([]);
    //     const[selectedVehicle, setSelectedVehicle] = useState([]);

    //     useEffect(() => {
    //         const fetchVehicles = async() => {
    //             try{
    //                 const vehicleCollection = collection(db, "vehicles");
    //                 const vehicleSnapshot = await getDocs(vehicleCollection);
    //                 const vehicleList = vehicleSnapshot.docs.map((doc) => ({
    //                     id: doc.id,
    //                     ...doc.data()
    //                 }));
    //                 setVehicles(vehicleList);
    //             } catch( error) {
    //                 console.error("Error fetching vehicles: ", error);
    //             }
    //             
    //         };
    //        fetchVehicles();
    //     }, []);
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);

        if (startTime && endTime) {
            try {
                const auth = getAuth();
                const currentUser = auth.currentUser;

                if (currentUser) {
                    // Get the ID token
                    const idToken = await currentUser.getIdToken(true);

                    let data = {
                        startTime: startTime,
                        endTime: endTime,
                        userId: currentUser.uid
                    };

                    // Call the addBooking Cloud Function
                    const response = await fetch('https://addbooking-w2ytv3mava-uc.a.run.app', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${idToken}`,
                        },
                        body: JSON.stringify(data),
                    });
    
                    if (response.ok) {
                        const result = await response.json();
                        console.log("Booking added successfully!", result);
                        // Optionally, update your UI or state here
                    } else {
                        const error = await response.json();
                        console.error("Error adding booking: ", error.error);
                        // Optionally, display the error message to the user
                    }
                } else {
                    // User is not authenticated
                    console.error("User is not authenticated.");
                    // Redirect to login page or show an error message
                }
            } catch (error) {
                console.error("Error calling Cloud Function: ", error);
                // Handle network errors or unexpected issues
            }
        } else {
            console.error("Start time and end time are required.");
        }

        onClose();
    };

    return (
            <Modal isOpen={isOpen} onRequestClose={onClose} style={{overlay: {zIndex:1000}}}>
                <div className='ModalWrapper'>
                    <div className='ModalContent'>
                        <h2>Make a Reservation</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Start Time:
                                <br/>
                                <input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </label>
                            <br/>
                            <br/>
                            <label>
                                End Time
                                <br/>
                                <input 
                                    type="datetime-local" 
                                    value={endTime} 
                                    onChange={(e) => setEndTime(e.target.value)} 
                                    required 
                                />
                            </label>
                            <br/>
                            {/* <label htmlFor="vehicle_dropdown">Vehicle:</label>
                            <select id="dropdown" value={selectedOption} onChange={handleChange}>
                                <option value="">Select an Option</option>
                                {vehicles.map((vehicle) =>(
                                    <option key={vehicle.id} value={vehicle.nickname}>
                                        {vehicle.nickname}
                                    </option>
                                ))}
                            </select> */}
                            <br/>
                            <div style={{display: 'flex',gap: '10px',justifyContent: 'center',marginTop: '20px'}}>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={onClose}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
    );   
}