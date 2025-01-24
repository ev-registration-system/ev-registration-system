import React, { useState, useEffect } from "react";

const EmissionDisplay: React.FC = () => {
    const [currentEmission, setCurrentEmission] = useState<number | null>(null);
    const [currentHour, setCurrentHour] = useState<number | null>(null);

// Emission data array 
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

  useEffect(() => {
    // Hardcoded date: "2024-01-01"
    const now = new Date();
    const currentHour = now.getHours();
    const currentDate = "2024-01-01";

    // Find the emission data for the current hour
    const emissionRecord = emissionData.find(
      (record) => record.date === currentDate && record.hour === currentHour
    );

    setCurrentHour(currentHour);
    if (emissionRecord) {
      setCurrentEmission(emissionRecord.emissionFactor);
    } else {
      setCurrentEmission(null);
    }
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Current Hour Emission</h1>
      {currentHour !== null && (
        <p>
          Current Hour: <strong>{currentHour}</strong>
        </p>
      )}
      {currentEmission !== null ? (
        <p>
          The emission factor for the current hour is: <strong>{currentEmission.toFixed(6)}</strong> kg CO₂ per kWh.
        </p>
      ) : (
        <p>No emission data available for the current hour.</p>
      )}
    </div>
  );
};

export default EmissionDisplay;
