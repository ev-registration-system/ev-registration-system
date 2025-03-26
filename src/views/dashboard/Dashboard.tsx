import { useAuth } from "../../state/AuthProvider/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import NotificationModal from "../../components/Notifications/NotificationModal";
import { Accordion, AccordionSummary, Box, Card, CardContent, Grid2, Stack, Typography, useTheme } from '@mui/material'
import { tokens } from '../../Theme'
import { Booking, Vehicle } from 'src/types/types'
import { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase'
import { Timestamp } from 'firebase-admin/firestore'
import { ExpandMore } from '@mui/icons-material'
import EmissionsLineChart from '../../components/EmissionsLineChart/EmissionsLineChart'

const Dashboard = () => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	const user = getAuth().currentUser?.uid
	const [showModal, setShowModal] = useState(false);
	const [hasSeenModal, setHasSeenModal] = useState(
		sessionStorage.getItem("hasSeenModal") === "true"
	  );
  
	useEffect(() => {
	  const checkUserData = async () => {
		const { user } = useAuth();
		if (!user) return; // Ensure the user is logged in
  
		const userRef = doc(db, "users", user.uid);
		const userSnap = await getDoc(userRef);
  
		if (userSnap.exists()) {
		  const userData = userSnap.data();
		  const email = userData?.email || "";
		  const phoneNumber = userData?.phoneNumber || "";
  
		  if ((email === "" || phoneNumber === "") && !hasSeenModal && !(userData.optedOut)) {
			setShowModal(true);
			sessionStorage.setItem("hasSeenModal", "true");
			setHasSeenModal(true);
		  }
		}
	  };
  
	  checkUserData();
	}, [hasSeenModal]);

	const [bookings, setBookings] = useState<Booking[] | null>(null);
	const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);


	const fetchBookings = async () => {
		if(user){
			try{
				const q = query(collection(db, "bookings"), where("userId", "==", user))
				const querySnapshot = await getDocs(q)

				const bookingsData: Booking[] = querySnapshot.docs.map((doc) => {
					const data = doc.data();
					return{
						id: doc.id,
						startTime: (data.startTime as Timestamp).toDate(),
						endTime: (data.endTime as Timestamp).toDate(),
						userId: data.userId,
						checkedIn: data.checkedIn,
						vehicleId: data.vehicleId
					};
				});
				setBookings(bookingsData)
				console.log(getAuth().currentUser?.uid)
			} catch (error){
				console.log(error)
			}
		}
	}
	
	const fetchVehicles = async () => {
		if(user){
			try{
				const q = query(collection(db, "vehicles"), where("user_id", "==", user))
				const querySnapshot = await getDocs(q)
				const vehiclesData: Vehicle[] = querySnapshot.docs.map((doc) => {
					const data = doc.data();
					return{
						id: doc.id,
						license: data.license,
						make: data.make,
						model: data.model,
						year: data.year,
						color: data.color
					};
				});
				setVehicles(vehiclesData)
				console.log(vehiclesData)
			} catch(error){
				console.log(error)
			}
		}
	}


	useEffect(() => {
		fetchBookings();
		fetchVehicles();
	}, []);

	const mergedBookings = bookings?.map((booking) => {
		const vehicle = vehicles?.find((v) => v.id === booking.vehicleId);
		return {
		  ...booking,
		  vehicle,
		};
	  });
	
	return (
		<Box m="20px">
			{/* Header */}
			<Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
				<Typography variant="h2" fontWeight="bold" color={colors.grey[100]}>
					Welcome to the Booking Dashboard
				</Typography>
			</Box>
			<Stack spacing={2}>
				<div>
					<Typography variant='h3'>
						Upcoming Bookings
					</Typography><br/>
					<Grid2 container justifyContent="center" alignItems="center" spacing={2}>
						{mergedBookings?.map((booking) => (
						<Grid2 size={{xs:12, sm:6, md:4}} key={booking.id}>
							<Card variant='outlined' sx={{ backgroundColor: '#f0f0f0' }}>
								<CardContent>
									<Typography variant='h5' fontWeight="bold">
										Date: {booking.startTime.toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												})}
									</Typography>
									<Typography variant='h6'>
										Start Time: {booking.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br/>
										End Time: {booking.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br/>
										Vehicle Booked: {booking.vehicle?.make} {booking.vehicle?.model} {booking.vehicle?.license}
									</Typography>
								</CardContent>
							</Card>
						</Grid2>
					))}
					</Grid2>
				</div>
				<div>
				<Typography variant="h3">Vehicles Registered</Typography>
				<Grid2 container justifyContent="center" alignItems="center" spacing={2}>
				{vehicles?.length === 0 ? 
				(<Typography variant="h6">No Vehicles Registered</Typography>) : 
				
				(vehicles?.map((vehicle) => (
					<Accordion key={vehicle.id} sx={{ backgroundColor: '#f0f0f0' }}>
						<AccordionSummary
							expandIcon={<ExpandMore/>}
							aria-controls={`panel${vehicle.id}-content`}
							id={`panel${vehicle.id}-content`}
						>
							<Typography component={"span"}>License: {vehicle.license}</Typography>
						</AccordionSummary>
						<AccordionSummary>
							Make: {vehicle.make} <br/>
							Model: {vehicle.model} <br/>
							Year: {vehicle.year} <br/>
							Color: {vehicle.color}
						</AccordionSummary>
					</Accordion>
				)))}
			</Grid2>
					
				</div>
				<div>
					<Typography variant='h3'>
						Hourly Emissions Price
					</Typography>
					<div>
						<EmissionsLineChart/>
					</div>
				</div>

				{/* <div>
					<Typography variant='h3'>
						Notifications
					</Typography>
				</div> */}
			</Stack>
		</Box>
	)
}

export default Dashboard
