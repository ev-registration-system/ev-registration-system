import { getAuthToken } from "./authUtils";
import { EmissionsData } from "../types/types";

// This function uses the getEmissionsData cloud function to return an array of the emissions data
export const fetchEmissionsData = async () => {
    try {
        const idToken = await getAuthToken();
        if (!idToken) return [];

        const response = await fetch(
            `http://127.0.0.1:5001/ev-registration-system/us-central1/getEmissionsData`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            }
        );

        if (response.ok) {
            return await response.json() as EmissionsData[];
        } else {
            const error = await response.json();
            console.error("Error fetching emissions:", error.error);
            return [];
        }
    } catch (error) {
        console.error("Error calling Cloud Function:", error);
        return [];
    }
};