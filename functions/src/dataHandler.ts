import * as admin from "firebase-admin"
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger"

export interface Data{
    id?: string;
    usage: number;
    user_id: string;
    vehicle_id: string;
    entryTime?: Timestamp;
}


if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore()

class DataHandler{

    private static COLLECTION_NAME = "data";

    // static receiveData = onRequest(async (request, response) => {
    //     logger.info("receiveData function triggered", {structuredData: true});

    //     const {usage, user_id, vehicle} = request.body

    //     if(!usage || !user_id || !vehicle){
    //         logger.error("Missing required fields", {usage, user_id, vehicle});
    //         response.status(404).send("Missing required fields")
    //         return;
    //     }

    //     try{
    //         const ref = db.collection(DataHandler.COLLECTION_NAME);
    //         await ref.add({
    //             usage: usage,
    //             user_id: user_id,
    //             vehicle: vehicle,
    //         });
    //         logger.info("Data successfully added", {usage, user_id, vehicle});
    //         response.send(200).send("Data successfully added!");
    //     } catch (error) {
    //         logger.error("Error adding data", error);
    //         response.status(500).send("Error adding data");
    //     }
    // });

    static async receiveData(newData: Data){
        try{
            const ref = db.collection(DataHandler.COLLECTION_NAME);
            const docRef = await ref.add({
                usage: newData.usage,
                user_id: newData.user_id,
                vehicle_id: newData.vehicle_id,
                entryTime: FieldValue.serverTimestamp()
            });

            const querySnapchot = await docRef.get()
            const dataEntered: Data = {
                id: querySnapchot.id,
                ...querySnapchot.data()
            } as Data;
            logger.info("Data successfully added", {dataEntered});
            return dataEntered
        } catch (error) {
            logger.error("Error adding data", error);
            throw new Error("Error adding data");
        }
    }

    static async RetrieveHistoricalData(start: admin.firestore.Timestamp, end: admin.firestore.Timestamp){
        try{
            const ref = db.collection(DataHandler.COLLECTION_NAME);
            const query = ref.where("entryTime", ">=", start).where("entryTime", "<=", end);
            const querySnapchot = await query.get();

            if(querySnapchot.empty){
                return [];
            }

            const result: Data[] = querySnapchot.docs.map(doc => {
                const data = doc.data()
                return{
                    id: doc.id,
                    usage: data.usage,
                    user_id: data.user_id,
                    vehicle_id: data.vehicle_id,
                    entryTime: data.entryTime.toDate()
                } as Data;
            });

            logger.info("Historical data retrived", {result});
            return result;
        } catch(error){
            logger.error("Error retrieving historical data", error);
            throw new Error("Error retrieving historical data");
        }
    }
}

export const receiveData = DataHandler.receiveData;
export const RetrieveHistoricalData = DataHandler.RetrieveHistoricalData;