import { getAuthToken } from "./getAuthToken";
import { Booking } from "../types/types";

export const addBooking = async (startTime: string, endTime: string, userId: string, vehicleId: string): Promise<void> => {
    try {
        const idToken = await getAuthToken();
        if (!idToken) return;

        const data: Omit<Booking, 'id'> = {
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            userId,
            checkedIn: false,
            vehicleId, 
        };

        //Selects URL based on if local or deployed
        const BASE_URL =
            import.meta.env.MODE === "development"
                ? "http://127.0.0.1:5001/ev-registration-system/us-central1/addBooking"
                : "https://addbooking-w2ytv3mava-uc.a.run.app";

        const response = await fetch(
            BASE_URL, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
                body: JSON.stringify(data),
            }
        );

        if (response.ok) {
            const result = await response.json();
            console.log("Booking added successfully!", JSON.stringify(result, null, 2));
        } else {
            const error = await response.json();
            console.error("Error adding booking:", JSON.stringify(error, null, 2));
        }
    } catch (error) {
        console.error("Error calling Cloud Function:", error);
    }
};