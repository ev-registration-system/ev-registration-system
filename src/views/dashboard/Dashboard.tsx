import { Box, Button, Typography, useTheme } from '@mui/material'
import { tokens } from '../../Theme'

const Dashboard = () => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	return (
		<Box m="20px">
			{/* Header */}
			<Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
				<Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
					Welcome to the Booking Dashboard
				</Typography>
			</Box>
		</Box>
	)
}

export default Dashboard
