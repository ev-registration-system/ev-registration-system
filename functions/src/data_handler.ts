import {onRequest} from "firebase-functions/v2/https"
import * as admin from "firebase-admin"
import * as logger from "firebase-functions/logger"

const db = admin.firestore()

class DataHandler{

    private static COLLECTION_NAME = "data";

    static receiveData = onRequest(async (request, response) => {
        logger.info("receiveData function triggered", {structuredData: true});

        const {usage, user_id, vehicle} = request.body

        if(!usage || !user_id || !vehicle){
            logger.error("Missing required fields", {usage, user_id, vehicle});
            response.status(404).send("Missing required fields")
            return;
        }

        try{
            const ref = db.collection(DataHandler.COLLECTION_NAME);
            await ref.add({
                usage: usage,
                user_id: user_id,
                vehicle: vehicle,
            });
            logger.info("Data successfully added", {usage, user_id, vehicle});
            response.send(200).send("Data successfully added!");
        } catch (error) {
            logger.error("Error adding data", error);
            response.status(500).send("Error adding data");
        }
    });

    // const receiveData = async (user_id: number, usage: number, time: Timestamp, vehicle: number) => {
    //     try{
    //         await addDoc(ref, {
    //             timestamp: time,
    //             usage: usage,
    //             user: user_id,
    //             vehicle: vehicle
    //         });
    //     } catch (error) {
    //         console.error("Cannot add data: ", error);
    //     }
    // }

    static async RetrieveHistoricalData(start: admin.firestore.Timestamp, end: admin.firestore.Timestamp){
        try{
            const ref = db.collection(DataHandler.COLLECTION_NAME);
            const query = ref.where("timestamp", ">=", start).where("timestamp", "<=", end);

            const querySnapchot = await query.get();
            const result: any[] = [];

            querySnapchot.forEach((doc) => {
                result.push({id: doc.id, ...doc.data()});
            });

            logger.info("Historical data retrived", {result});
            return result;
        } catch(error){
            logger.error("Error retrieving historical data", error);
            throw new Error("Error retrieving historical data");
        }
    }

            //     try {
    //         const q = query(
    //             ref,
    //             where("startTime", ">=", start),
    //             where("endTime", "<=", end)
    //         );

    //         const result = await getDocs(q);
    //         result.forEach((doc) => {
    //             //add to array or arraylist to be sent to front end
    //         });
    //     } catch (error) {
    //          console.error("Error retrieving data: ", error);
    //     }

}