import * as admin from "firebase-admin"
import * as logger from "firebase-functions/logger"

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore()

export interface Vehicle{
    id?: string,
    license: string,
    user_id: string,
    make: string,
    model: string,
    year: string,
    color: string
}

class vehicleHandler{
    private static COLLECTION_NAME = "vehicles"

    // static addVehicle = onRequest(async (request, response) => {
    //     logger.info("add vehicle function triggered", {structuredData: true});

    //     const {license, user_id, make, model, year, color} = request.body

    //     if(!license || !user_id || !make || !model || !year || !color){
    //         logger.error("Missing required fields", {license, user_id, make, model, year, color});
    //         response.status(404).send("Missing required fields")
    //         return;
    //     }

    //     try{
    //         const ref = db.collection(vehicleHandler.COLLECTION_NAME);
    //         await ref.add({
    //             license: license,
    //             user_id: user_id,
    //             make: make,
    //             model: model,
    //             year: year,
    //             color: color
    //         });
    //         logger.info("Vehicle successfully added", {license, user_id, make, model, year, color});
    //         response.status(200).send("Vehicle successfully added");
    //     } catch (error){
    //         logger.error("Error adding vehicle", error);
    //         response.status(500).send("Error adding vehicle");
    //     }
    // });

    static async addVehicle(vehicleToAdd: Vehicle){
        try{
            const ref = db.collection(vehicleHandler.COLLECTION_NAME);
            const docRef = await ref.add({
                license: vehicleToAdd.license,
                user_id: vehicleToAdd.user_id,
                make: vehicleToAdd.make,
                model: vehicleToAdd.model,
                year: vehicleToAdd.year,
                color: vehicleToAdd.color
            });

            const querySnapchot = await docRef.get()
            const vehicleAdded: Vehicle = {
                id: querySnapchot.id,
                ...querySnapchot.data()
            } as Vehicle
            logger.info("Vehicle successfully added", {vehicleAdded});
            return vehicleAdded
        } catch (error){
            logger.error("Error adding vehicle", error);
            throw new Error("Error adding vehicle");
        }
    }
    

    // static getVehicle = onRequest(async (request, response) => {
    //     const user_id = request.query.id as string;
    //     if(!user_id){
    //         logger.error("Missing user ID in query parameters");
    //         response.status(400).send("Missing user ID");
    //         return;
    //     }
    //     try{
    //         const ref = db.collection(vehicleHandler.COLLECTION_NAME);
    //         const query = ref.where("user_id", "==", user_id);
    //         const querySnapchot = await query.get();

    //         const result: any[] = [];

    //         querySnapchot.forEach((doc) => {
    //             result.push({id: doc.id, ...doc.data()});
    //         });

    //         logger.info("User Vehicles retrieved", {user_id, result});
    //         response.status(200).json(result);
            
    //     } catch(error){
    //         logger.error("Error retrieving user vehicles", error);
    //         response.status(500).send("Error retrieving user vehicles");
    //     }
    // });

    static async getVehicle(user_id: string){
        try{
            const ref = db.collection(vehicleHandler.COLLECTION_NAME);
            const query = ref.where("user_id", "==", user_id);
            const querySnapchot = await query.get();

            if(querySnapchot.empty){
                return [];
            }

            const vehicles: Vehicle[] = querySnapchot.docs.map(doc => {
                const data = doc.data()
                return{
                    id: doc.id,
                    license: data.license,
                    user_id: data.user_id,
                    make: data.make,
                    model: data.model,
                    year: data.year,
                    color: data.color
                } as Vehicle;
            });

            logger.info("User Vehicles retrieved", {vehicles});
            return vehicles;
        } catch(error){
            logger.error("Error retrieving user vehicles", error);
            throw new Error("Error retrieving vehicles");
        }
    }

    static async deleteVehicle(vehicle_id: string){
        try{
            db.collection(vehicleHandler.COLLECTION_NAME).doc(vehicle_id).delete();
            return true
        } catch (error){
            logger.info("Error delete vehicle", error);
            throw new Error("Error deleting vehicle");
        }
    }
}

export const addVehicle = vehicleHandler.addVehicle;
export const getVehicle = vehicleHandler.getVehicle;
export const deleteVehicle = vehicleHandler.deleteVehicle;