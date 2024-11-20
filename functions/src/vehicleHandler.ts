import {onRequest} from "firebase-functions/v2/https"
import * as admin from "firebase-admin"
import * as logger from "firebase-functions/logger"

const db = admin.firestore()

class vehicleHandler{
    private static COLLECTION_NAME = "vehicles"

    static addVehicle = onRequest(async (request, response) => {
        logger.info("add vehicle function triggered", {structuredData: true});

        const {license, user_id, make, model, year, color} = request.body

        if(!license || !user_id || !make || !model || !year || !color){
            logger.error("Missing required fields", {license, user_id, make, model, year, color});
            response.status(404).send("Missing required fields")
            return;
        }

        try{
            const ref = db.collection(vehicleHandler.COLLECTION_NAME);
            await ref.add({
                license: license,
                user_id: user_id,
                make: make,
                model: model,
                year: year,
                color: color
            });
            logger.info("Vehicle successfully added", {license, user_id, make, model, year, color});
            response.status(200).send("Vehicle successfully added");
        } catch (error){
            logger.error("Error adding vehicle", error);
            response.status(500).send("Error adding vehicle");
        }
    });
    

    static getVehicle = onRequest(async (request, response) => {
        const user_id = request.query.id as string;
        if(!user_id){
            logger.error("Missing user ID in query parameters");
            response.status(400).send("Missing user ID");
            return;
        }
        try{
            const ref = db.collection(vehicleHandler.COLLECTION_NAME);
            const query = ref.where("user_id", "==", user_id);
            const querySnapchot = await query.get();

            const result: any[] = [];

            querySnapchot.forEach((doc) => {
                result.push({id: doc.id, ...doc.data()});
            });

            logger.info("User Vehicles retrieved", {user_id, result});
            response.status(200).json(result);
            
        } catch(error){
            logger.error("Error retrieving user vehicles", error);
            response.status(500).send("Error retrieving user vehicles");
        }
    });
}

export const addVehicle = vehicleHandler.addVehicle;
export const getVehicle = vehicleHandler.getVehicle;