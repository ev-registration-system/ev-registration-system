import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme, Box, Typography } from '@mui/material';
import { tokens } from '../../Theme';
import { fetchEmissionsData } from "../../utils/fetchEmissionsData";

const EmissionsLineChart: React.FC = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [currentHour, setCurrentHour] = useState<number>(0);
	const [currentDay, setCurrentDay] = useState<string>(new Date().toISOString().split("T")[0]);
	const [currentEmission, setCurrentEmission] = useState<number | null>(null);
	const [emissionData, setEmissionData] = useState<{ date: string; hour: number; emissionFactor: number }[]>([]);

	useEffect(() => {
        const fetchEmissions = async () => {
			const data = await fetchEmissionsData();
            setEmissionData(data);
        };

        fetchEmissions();
    }, [currentDay]); // Update data whenever the day changes

	useEffect(() => {
		const now = new Date();
		const currentHour = now.getHours();
		setCurrentHour(currentHour);
		//Note we might want to set an interval to update the current day, as there is no need to do it constantly
		const currentDay = now.toISOString().split("T")[0];
		setCurrentDay(currentDay);

		if (emissionData.length > 0) { 
			const emissionRecord = emissionData.find(
				(record) => record.date === currentDay && record.hour === currentHour
			);
			setCurrentEmission(emissionRecord ? emissionRecord.emissionFactor : null);
		}
	}, [currentHour, emissionData]);

	const filteredData = useMemo(() => {
		return emissionData.filter((entry) => entry.hour <= currentHour); // This makes sure only data up to current hour is displayed
	}, [currentHour, emissionData]);

	const chartData = useMemo(() => {
		return [
			{
				id: 'Emission Factor',
				color: colors.accent[400],
				data: filteredData.map((entry) => ({
					x: entry.hour, 
					y: entry.emissionFactor,
				})),
			},
		];
	}, [filteredData, colors.accent]);

	return (
		<Box sx={{ width: '100%', height: '500px' }}>
            <Box
                sx={{
                backgroundColor: colors.accent[400],
                padding: 1,
                borderRadius: 2,
                boxShadow: 3, 
                marginBottom: 3,
                display: 'inline-block',
                height: '40px', 
                }}
            >

			    {/* Display Current Hour and Emission */}
			    {currentEmission !== null ? (
				    <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" sx={{ mb: 3 }}>
					    Current Emission Factor for Hour {currentHour}: <strong>{currentEmission.toFixed(6)} kg CO₂/kWh</strong>
				    </Typography>
			    ) : (
				    <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" sx={{ mb: 3 }}>
					    No emission data available for the current hour.
				    </Typography>
			    )}
            </Box>
			
			{(!chartData || chartData.length === 0 || chartData[0].data.length === 0) ? (
            	<Typography variant="h6" color={colors.grey[100]} sx={{ mt: 3 }}>
                	No emissions data available to display.
            	</Typography>
        	) : (
				<ResponsiveLine
					data={chartData}
					theme={{
						axis: {
							domain: {
								line: {
									stroke: colors.grey[100],
								},
							},
							legend: {
								text: {
									fill: colors.grey[100],
								},
							},
							ticks: {
								line: {
									stroke: colors.grey[100],
									strokeWidth: 1,
								},
								text: {
									fill: colors.grey[100],
								},
							},
						},
						legends: {
							text: {
								fill: colors.grey[100],
							},
						},
						tooltip: {
							container: {
								color: colors.accent[400],
							},
						},
					}}
					colors={colors.accent[400]}
					margin={{ top: 50, right: 60, bottom: 110, left: 60 }}
					xScale={{ type: 'point' }}
					yScale={{
						type: 'linear',
						min: 0.5,
						max: 'auto',
						stacked: false,
					}}
					axisTop={null}
					axisRight={null}
					axisBottom={{
						tickSize: 0,
						tickPadding: 5,
						tickRotation: 0,
						legend: 'Hour of the Day',
						legendOffset: 36,
						legendPosition: 'middle',
					}}
					axisLeft={{
						tickValues: 5,
						tickSize: 3,
						tickPadding: 5,
						tickRotation: 0,
						legend: 'Emission Factor (kg CO₂ per kWh)',
						legendOffset: -50,
						legendPosition: 'middle',
					}}
					enableGridX={false}
					enableGridY={false}
					pointSize={6}
					pointColor={colors.accent[400]}
					pointBorderWidth={1}
					pointBorderColor={{ from: 'serieColor' }}
					pointLabelYOffset={-12}
					useMesh={true}
					tooltip={({ point }) => (
						<div
							style={{
								background: colors.accent[200],
								padding: '5px 10px',
								borderRadius: '3px',
								maxWidth: '150px',  
								overflow: 'hidden', 
								wordWrap: 'break-word', 
							}}
						>
							<strong style={{ color: colors.grey[300] }}>
								Hour: {point.data.xFormatted}
							</strong>
							<br />
							<strong style={{ color: colors.grey[300] }}>
								Emission Factor: {point.data.yFormatted} kg CO₂/kWh
							</strong>
						</div>
					)}
					enableCrosshair={false}
				/>
			)}
		</Box>
	);
};

export default EmissionsLineChart;