import { getAuth } from "firebase/auth";
import { getAuthToken } from "./getAuthToken"; 

export const getUserId = (): string | null => {
    //This sets up user id for unit tests
    if (process.env.NODE_ENV === "test") {
        return "mock-user-id"; //Mock user ID for tests
    }
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        console.error("Error: User is not authenticated.");
        return null;
    }

    return currentUser.uid;
};

export const addUser = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        console.error("Error: No authenticated user.");
        return;
    }

    try {
        const idToken = await getAuthToken();
        const userData = {
            userId: currentUser.uid,
            username: currentUser.displayName || "Unnamed User",
            email: currentUser.email || "",
            role: "user", // Default role
        };

        const BASE_URL =
            import.meta.env.MODE === "development"
                ? "http://127.0.0.1:5001/ev-registration-system/us-central1/addUser"
                : "https://adduser-w2ytv3mava-uc.a.run.app";

        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`Failed to add user: ${response.statusText}`);
        }

        console.log("User successfully added to Firestore!");
    } catch (error) {
        console.error("Error adding user to Firestore:", error);
    }
};