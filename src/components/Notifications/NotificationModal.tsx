import { useState } from 'react';
import Modal from 'react-modal';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}


const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [optedOut, setOptedOut] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email && phone) {
            try {
                const auth = getAuth();
                const currentUser = auth.currentUser;

                if (currentUser) {
                    const userRef = doc(db, "users", currentUser.uid);
                    await updateDoc(userRef, {
                        email: email,
                        phoneNumber: phone,
                        optedOut: optedOut,
                    })
                    onClose();               
                } else {
                    console.error("User is not authenticated.");
                }
            } catch (error) {
                console.error("Error calling notification endpoint: ", error);
            }
        } else {
            console.error("Both email and phone number are required.");
        }
    };

    const handleLater = async () => {
        if (optedOut) {
            try {
                const auth = getAuth();
                const currentUser = auth.currentUser;

                if (currentUser) {
                    const userRef = doc(db, "users", currentUser.uid);
                    await updateDoc(userRef, {optedOut: optedOut});
                } else {
                    console.error("User is not authenticated.");
                }
            } catch (error) {
                console.error("Error calling notification endpoint: ", error);
            }
        }

        //test code, delete later

        const sessionStart = '2025-03-09T10:00:00.000Z'
        const sessionEnd = '2025-03-09T10:15:00.000Z'
        const price = 15.00   

        const testPhone = "+15068382586"
        const to  = testPhone;
        const body = "Your session from " + sessionStart + " to " + sessionEnd + " has ended.\n Amount due: $" + price + " CAD\n Proceed to pay at XYZ Location";
        const message = {
            to,
            body
          }

        const ref = collection(db, "messages");
        const result = await addDoc(ref, message);
        
        onClose();
    }

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
                <h2>Opt-in for Notifications</h2>
                <p>In order for us to send you notifications on upcoming bookings and more, we need your contact information.</p>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email Address:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <br /><br />
                    <label>
                        Phone Number:
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </label>
                    <br /><br />
                    
                    <label>
                        <input
                            type="checkbox"
                            checked={optedOut}
                            onChange={() => setOptedOut(true)}
                        />
                        Don't show this again (Notifications can be changed on the Home page)
                    </label>
                    
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={handleLater}>Later</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default NotificationModal;
