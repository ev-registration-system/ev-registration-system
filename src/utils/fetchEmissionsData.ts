import { getAuthToken } from "./getAuthToken";
import { EmissionsData } from "../types/types";

// This function uses the getEmissionsData cloud function to return an array of the emissions data
export const fetchEmissionsData = async () => {
    try {
        const idToken = await getAuthToken();
        if (!idToken) return [];

        //This uses the appropriate address depending on if being called locally/emulator or deployed
        const BASE_URL =
            import.meta.env.MODE === "development"
                ? "http://127.0.0.1:5001/ev-registration-system/us-central1/getEmissionsData"
                : "https://getemissionsdata-w2ytv3mava-uc.a.run.app";

        const response = await fetch(
            BASE_URL,
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