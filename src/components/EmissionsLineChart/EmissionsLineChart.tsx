import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme, Box, Typography } from '@mui/material';
import { tokens } from '../../Theme';

const EmissionsLineChart: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const emissionData = [
    { date: "2024-01-01", hour: 1, emissionFactor: 0.52096844 },
    { date: "2024-01-01", hour: 2, emissionFactor: 0.54082056 },
    { date: "2024-01-01", hour: 3, emissionFactor: 0.5501421 },
    { date: "2024-01-01", hour: 4, emissionFactor: 0.56156863 },
    { date: "2024-01-01", hour: 5, emissionFactor: 0.56156863 },
    { date: "2024-01-01", hour: 6, emissionFactor: 0.53037037 },
    { date: "2024-01-01", hour: 7, emissionFactor: 0.50758621 },
    { date: "2024-01-01", hour: 8, emissionFactor: 0.50709677 },
    { date: "2024-01-01", hour: 9, emissionFactor: 0.52196721 },
    { date: "2024-01-01", hour: 10, emissionFactor: 0.53754386 },
    { date: "2024-01-01", hour: 11, emissionFactor: 0.54037736 },
    { date: "2024-01-01", hour: 12, emissionFactor: 0.54552381 },
    { date: "2024-01-01", hour: 13, emissionFactor: 0.54552381 },
    { date: "2024-01-01", hour: 14, emissionFactor: 0.54552381 },
    { date: "2024-01-01", hour: 15, emissionFactor: 0.53037037 },
    { date: "2024-01-01", hour: 16, emissionFactor: 0.51448276 },
    { date: "2024-01-01", hour: 17, emissionFactor: 0.50885246 },
    { date: "2024-01-01", hour: 18, emissionFactor: 0.50885246 },
    { date: "2024-01-01", hour: 19, emissionFactor: 0.51733333 },
    { date: "2024-01-01", hour: 20, emissionFactor: 0.52660152 },
    { date: "2024-01-01", hour: 21, emissionFactor: 0.52477565 },
    { date: "2024-01-01", hour: 22, emissionFactor: 0.50954121 },
    { date: "2024-01-01", hour: 23, emissionFactor: 0.52096844 },
    { date: "2024-01-01", hour: 24, emissionFactor: 0.52096844 },
  ];

  const [currentHour, setCurrentHour] = useState<number>(0);
  const [currentEmission, setCurrentEmission] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours(); 
    setCurrentHour(currentHour); 

    const emissionRecord = emissionData.find(
      (record) => record.date === "2024-01-01" && record.hour === currentHour
    );

    if (emissionRecord) {
      setCurrentEmission(emissionRecord.emissionFactor);
    } else {
      setCurrentEmission(null);
    }
  }, [currentHour]);

  const filteredData = useMemo(() => {
    return emissionData.filter((entry) => entry.hour <= currentHour); 
  }, [currentHour]);

  const chartData = useMemo(() => {
    return [
      {
        id: 'Emission Factor',
        color: colors.accent[400],
        data: filteredData.map((entry) => ({
          x: `Hour ${entry.hour}`, 
          y: entry.emissionFactor,
        })),
      },
    ];
  }, [filteredData, colors.accent]);

  return (
    <Box sx={{ width: '100%', height: '500px' }}>
      {/* Display Current Hour and Emission */}
      {currentEmission !== null ? (
        <Typography variant="h5" color={colors.accent[400]} fontWeight="bold" sx={{ mb: 3 }}>
          Current Emission Factor for Hour {currentHour}: <strong>{currentEmission.toFixed(6)} kg CO₂/kWh</strong>
        </Typography>
      ) : (
        <Typography variant="h5" color={colors.grey[300]} fontWeight="bold" sx={{ mb: 3 }}>
          No emission data available for the current hour.
        </Typography>
      )}
      
      {/* Nivo Line Chart */}
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
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
            type: 'linear',
            min: 'auto',
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
            legendOffset: -40,
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
                background: colors.grey[900],
                padding: '5px 10px',
                borderRadius: '3px',
                }}
            >
                <strong style={{ color: colors.grey[300] }}>
                    Hour: {point.data.xFormatted}
                </strong>
                <br />
                <strong style={{ color: colors.accent[300] }}>
                    Emission Factor: {point.data.yFormatted} kg CO₂/kWh
                </strong>
            </div>
            )}
            enableCrosshair={false}
        />
    </Box>
  );
};

export default EmissionsLineChart;