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

    static async addVehicle(vehicleToAdd: Vehicle){
        try{
            const ref = db.collection(vehicleHandler.COLLECTION_NAME);
            console.log("Here")
            const docRef = await ref.add({
                license: vehicleToAdd.license,
                user_id: vehicleToAdd.user_id,
                make: vehicleToAdd.make,
                model: vehicleToAdd.model,
                year: vehicleToAdd.year,
                color: vehicleToAdd.color
            });

            console.log("Added")
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

    static async deleteVehicle(vehicle_id: string){
        try{
            await db.collection(vehicleHandler.COLLECTION_NAME).doc(vehicle_id).delete();
            return true
        } catch (error){
            logger.info("Error delete vehicle", error);
            throw new Error("Error deleting vehicle");
        }
    }
}

export const addVehicle = vehicleHandler.addVehicle;
//export const getVehicle = vehicleHandler.getVehicle;
export const deleteVehicle = vehicleHandler.deleteVehicle;