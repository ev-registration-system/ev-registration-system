import { getAuth } from "firebase/auth";

export const fetchEmissionsData = async () => {
    try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            console.error("User is not authenticated.");
            return [];
        }

        const idToken = await currentUser.getIdToken(true);

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
            return await response.json(); // Return data directly
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