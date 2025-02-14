import { getAuth } from "firebase/auth";

export const getUserId = (): string | null => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        console.error("Error: User is not authenticated.");
        return null;
    }

    return currentUser.uid;
};