/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as vehicle from "./vehicleHandler"
import * as user from "./userHandler"
import * as data from "./dataHandler"

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const addUser = onRequest(async (request, response) => {
    try{
        await user.addUser(request, response);
    } catch(error){
        logger.error("Error calling function addUser", error);
        response.status(500).send("Error calling function addUser");
    }
});


export const getUser = onRequest(async (request, response) => {
    try{
        await user.getUser(request, response);
    } catch (error) {
        logger.error("Error calling function getUser", error);
        response.status(500).send("Error calling function getUser");
    }
});


export const addVehicle = onRequest(async (request, response) => {
    try{
        await vehicle.addVehicle(request, response);
    } catch(error){
        logger.error("Error calling function addVehicle", error);
        response.status(500).send("Error calling function addVehicle");
    }
});


export const getVehicle = onRequest(async (request, response) => {
    try{
        await vehicle.getVehicle(request, response);
    } catch(error) {
        logger.error("Error calling funciton getVehicle"), error;
        response.status(500).send("Error calling functio getVehicle");

    }
});


export const receiveData = onRequest(async (request, response ) => {
    try{
        await data.receiveData(request, response);
    }catch(error) {
        logger.error("Error calling funciton receiveData"), error;
        response.status(500).send("Error calling functio receiveData");

    }
})