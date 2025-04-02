import { getAuthToken } from "./getAuthToken";

export const checkInController = async () => {
  try {
    const idToken = await getAuthToken();
    if (!idToken) {
      console.error("No valid auth token found.");
      return {};
    }

    const BASE_URL =
      import.meta.env.MODE === "development"
        ? "http://127.0.0.1:5001/ev-registration-system/us-central1/checkInController"
        : "https://checkincontroller-w2ytv3mava-uc.a.run.app"; 

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.json().catch(() => ({}));
      console.error("Error calling checkInController:", error.error || error);
      return {};
    }
  } catch (error) {
    console.error("Error calling checkInController function:", error);
    return {};
  }
};