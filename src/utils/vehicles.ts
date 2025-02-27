import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase"; 
import { Vehicle } from "../types/types";
import { getUserId } from "./users";

export const getUserVehicles = async (): Promise<Vehicle[]> => {
  const userId = getUserId();
  if (!userId) {
    console.error("User not authenticated");
    return [];
  }
  try {
    const vehiclesQuery = query(collection(db, "vehicles"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(vehiclesQuery);
    const vehicles: Vehicle[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        license: data.license,
        make: data.make,
        model: data.model,
        year: data.year,
        color: data.color,
      };
    });
    return vehicles;
  } catch (error) {
    console.error("Error retrieving vehicles:", error);
    return [];
  }
};