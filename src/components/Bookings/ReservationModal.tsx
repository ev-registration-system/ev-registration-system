import { useState } from 'react';
import Modal from 'react-modal';
import { calculateDynamicPrice } from '../../utils/calculateDynamicPrice';
import { addBooking } from '../../utils/addBooking';
import { getUserId } from "../../utils/getUserId";

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
}    

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
    const [dynamicPrice, setDynamicPrice] = useState<number | null>(null); // state to store dynamic price
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleTimeChange = async () => {
        if (startTime && endTime) {
            const price = await calculateDynamicPrice(startTime, endTime);
            setDynamicPrice(price);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (startTime && endTime) {
            const userId = getUserId();
            if (!userId) {
                console.error("Error: User is not authenticated.");
                return;
            }
            await addBooking(startTime, endTime, userId);
        } else {
            console.error("Start time and end time are required.");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: { zIndex: 2000, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                content: {
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
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
                <h2>Make a Reservation</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Start Time:
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => {setStartTime(e.target.value); handleTimeChange();}} 
                            required
                        />
                    </label>
                    <br /><br />
                    <label>
                        End Time:
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => {setEndTime(e.target.value); handleTimeChange();}}
                            required
                        />
                    </label>
                    <br /><br />
                    {dynamicPrice !== null && <p>Estimated Price: ${dynamicPrice.toFixed(2)}</p>}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ReservationModal;
