import { db } from "../firebase"
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore"

export async function DataHandler() {
    const ref = collection(db, "data");

    const receiveData = async (user_id: number, usage: number, time: Timestamp, vehicle: number) => {
        try{
            await addDoc(ref, {
                timestamp: time,
                usage: usage,
                user: user_id,
                vehicle: vehicle
            });
        } catch (error) {
            console.error("Cannot add data: ", error);
        }
    }

    const RetrieveHistoricalData = async (start: Timestamp, end: Timestamp) => {
        try {
            const q = query(
                ref,
                where("startTime", ">=", start),
                where("endTime", "<=", end)
            );

            const result = await getDocs(q);
            result.forEach((doc) => {
                //add to array or arraylist to be sent to front end
            });
        } catch (error) {
             console.error("Error retrieving data: ", error);
        }
    }
}