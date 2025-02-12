import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import React, { useState, useEffect, useMemo } from 'react';
import { getAuth } from 'firebase/auth';


const BASE_PRICE_PER_HOUR = 1.50;

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


export const calculateDynamicPrice = async (startTime: string, endTime: string): Promise<number> => {
    try {
        // Convert startTime and endTime to hours
        const startHour = new Date(startTime).getHours();
        const endHour = new Date(endTime).getHours();

        // Ensure startHour is less than endHour
        if (startHour >= endHour) {
            throw new Error('Start time must be before end time');
        }

        // Find emission factor range
        const emissionFactors = emissionData.map(d => d.emissionFactor);
        const min = Math.min(...emissionFactors);
        const max = Math.max(...emissionFactors);
        const range = max - min;

        // Define thresholds for  bins
        const lowThreshold = min + range / 3;
        const highThreshold = min + (2 * range) / 3;

        // Cumilative Sum
        let totalCost = 0;

        console.log("*****Dynamic Pricing Start*****")

        // Loop through the hours and sum the price based on emission category and the bins
        for (let hour = startHour; hour <= endHour; hour++) {
            const hourData = emissionData.find(d => d.hour === hour);
            if (!hourData) continue;

            let price = 0;

            if (hourData.emissionFactor < lowThreshold) {
                price = BASE_PRICE_PER_HOUR * 0.80; // Low Emission results in a x0.80 multiplier
                console.log("Hour:", hour, ", multiplier applied: x0.80, price: $", price)
            } else if (hourData.emissionFactor < highThreshold) {
                price = BASE_PRICE_PER_HOUR; // Medium Emission results in a x1.00 multiplier
                console.log("Hour:", hour, ", multiplier applied: x1.00, price: $", price)
            } else {
                price = BASE_PRICE_PER_HOUR * 1.50; // High Emission results in a x1.50 multiplier
                console.log("Hour:", hour, ", multiplier applied: x1.50, price: $", price)
            }

            totalCost += price;
        }
        console.log("*****Dynamic Pricing End*****")

        return parseFloat(totalCost.toFixed(2)); // Round to 2 decimal places
    } catch (error) { // Return base price and log error
        console.error('Error calculating dynamic price:', error);
        return BASE_PRICE_PER_HOUR; 
    }
};
