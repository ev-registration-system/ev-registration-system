import { useState } from 'react';
import Modal from 'react-modal';
import { getAuth } from 'firebase/auth';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email && phone) {
            try {
                const auth = getAuth();
                const currentUser = auth.currentUser;

                if (currentUser) {
                    const idToken = await currentUser.getIdToken(true);

                    const data = {
                        email,
                        phone,
                        userId: currentUser.uid
                    };
/*
                    const response = await fetch('https://', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${idToken}`,
                        },
                        body: JSON.stringify(data),
                    });

                    if (response.ok) {
                        console.log("Notification preferences updated successfully!");
                        onClose(); // Close modal after successful submission
                    } else {
                        const error = await response.json();
                        console.error("Error updating notification preferences:", error.error);
                    }*/
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
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Later</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default NotificationModal;
