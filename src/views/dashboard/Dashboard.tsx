import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../Theme";
import { useAuth } from "../../state/AuthProvider/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import NotificationModal from "../../components/Notifications/NotificationModal";

const Dashboard = () => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)
	const { user } = useAuth();
	const [showModal, setShowModal] = useState(false);
  
	useEffect(() => {
	  const checkUserData = async () => {
		if (!user) return; // Ensure the user is logged in
  
		const userRef = doc(db, "users", user.uid);
		const userSnap = await getDoc(userRef);
  
		if (userSnap.exists()) {
		  const userData = userSnap.data();
		  const email = userData?.email || "";
		  const phoneNumber = userData?.phoneNumber || "";
  
		  if (email === "" || phoneNumber === "") {
			setShowModal(true);
		  }
		}
	  };
  
	  checkUserData();
	}, []);


	return (
		<Box m="20px">
			{/* Header */}
			<Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
				<Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
					Welcome to the Booking Dashboard
				</Typography>
			</Box>

			{/* Show notification modal when required */}
			<NotificationModal isOpen={showModal} onClose={() => setShowModal(false)} />
    
		</Box>
	)
}

export default Dashboard
