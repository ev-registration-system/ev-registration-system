import {onRequest} from "firebase-functions/v2/https"
import * as admin from "firebase-admin"
import * as logger from "firebase-functions/logger"

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

    static async receiveData(usage: number, user_id: string, vehicle_id: string){
        try{
            const ref = db.collection(DataHandler.COLLECTION_NAME);
            await ref.add({
                usage: usage,
                user_id: user_id,
                vehicle_id: vehicle_id,
            });
            logger.info("Data successfully added", {usage, user_id, vehicle_id});
            return true
        } catch (error) {
            logger.error("Error adding data", error);
            throw new Error("Error adding data");
        }
    }

    static async RetrieveHistoricalData(start: admin.firestore.Timestamp, end: admin.firestore.Timestamp){
        try{
            const ref = db.collection(DataHandler.COLLECTION_NAME);
            const query = ref.where("timestamp", ">=", start).where("timestamp", "<=", end);

            const querySnapchot = await query.get();
            logger.info("Historical data retrived", {querySnapchot});
            return querySnapchot;
        } catch(error){
            logger.error("Error retrieving historical data", error);
            throw new Error("Error retrieving historical data");
        }
    }
}

export const receiveData = DataHandler.receiveData;
export const RetrieveHistoricalData = DataHandler.RetrieveHistoricalData;