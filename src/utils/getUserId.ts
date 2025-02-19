import { getAuth } from "firebase/auth";

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