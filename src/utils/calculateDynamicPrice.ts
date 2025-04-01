import { fetchEmissionsData } from "./fetchEmissionsData";
import { EmissionsData } from "../types/types";

const BASE_PRICE_PER_HOUR = 1.50;

export const calculateDynamicPrice = async (startTime: string, endTime: string): Promise<number> => {
    try {
        const emissionData: EmissionsData[] = await fetchEmissionsData();
        if (!emissionData || emissionData.length === 0) {
            throw new Error("Failed to fetch emissions data");
        }
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
                price = BASE_PRICE_PER_HOUR * 0.75; // Low Emission results in a x0.75 multiplier
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