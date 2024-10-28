import React, { useEffect, useState } from 'react';
import '../../stylings/ReservationButtons.css'
import '../../stylings/ModalStyling.css'
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import Modal from 'react-modal';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReservationModal({onClose, isOpen}: ReservationModalProps) {
    const ref = collection(db, "bookings");

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
            const start = new Date(startTime);
            const end = new Date(endTime);
            let data = {
                startTime: Timestamp.fromDate(start),
                endTime: Timestamp.fromDate(end)
            };

            try {
                await addDoc(ref, data);
                console.log("Booking added Successfully!");
            } catch (error) {
                console.error("Error adding booking: ", error);
            }
        }

        onClose();
    };

    return (
        <div>
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
        </div> 
    );   
}