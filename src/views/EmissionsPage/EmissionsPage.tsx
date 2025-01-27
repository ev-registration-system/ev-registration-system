import { Box, Typography, useTheme } from '@mui/material'
import EmissionsLineChart from '../../components/EmissionsLineChart/EmissionsLineChart'
import { tokens } from '../../Theme'

const EmissionsPage = () => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	return (
		<Box m="20px">
			{/* Header */}
			<Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
				<Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
					Welcome to the Emissions Page
				</Typography>
			</Box>

      {/* Line Chart */}
      <Box
        sx={{
          backgroundColor: colors.grey[900], 
          padding: 2,
          borderRadius: 2,
          boxShadow: 3, 
        }}
      >
        <EmissionsLineChart />
      </Box>
		</Box>
	)
}

export default EmissionsPage;