import { getAuth } from "firebase/auth";

export const getAuthToken = async (): Promise<string | null> => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        console.error("User is not authenticated.");
        return null;
    }

    try {
        return await currentUser.getIdToken(true);
    } catch (error) {
        console.error("Error fetching auth token:", error);
        return null;
    }
};