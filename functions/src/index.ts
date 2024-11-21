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

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


export const addUser = onRequest(async (request, response) => {
  const {username, password, email, phone} = request.body;
  if(!username || !password || !email || !phone){
    logger.error("Missing required fields", {username, password, email, phone});
    response.status(404).send("Missing required fields");
  }
    try{
        await user.addUser(username, password, email, phone);
    } catch(error){
        logger.error("Error calling function addUser", error);
        response.status(500).send("Error calling function addUser");
    }
});


export const getUser = onRequest(async (request, response) => {
  const {username, password} = request.body;
  if(!username || !password){
    logger.error("Missing required fields", {username, password});
    response.status(404).send("Missing required fields");
  }
    try{
        await user.getUser(username, password);
    } catch (error) {
        logger.error("Error calling function getUser", error);
        response.status(500).send("Error calling function getUser");
    }
});


export const addVehicle = onRequest(async (request, response) => {
  const {license, user_id, make, model, year, color} = request.body
  
  if(!license || !user_id || !make || !model || !year || !color){
    logger.error("Missing required fields", {license, user_id, make, model, year, color});
    response.status(404).send("Missing required fields")
    return;
  }

  try{
    await vehicle.addVehicle(license, user_id, make, model, year, color);
  } catch(error){
    logger.error("Error calling function addVehicle", error);
    response.status(500).send("Error calling function addVehicle");
  }
});


export const getVehicle = onRequest(async (request, response) => {
    const user_id = request.body.id as string;
    if(!user_id){
      logger.error("Missing required fields", {user_id});
      response.status(404).send("Missing required fields");
      return;
    }
    try{
        await vehicle.getVehicle(user_id);
    } catch(error) {
        logger.error("Error calling function getVehicle", error);
        response.status(500).send("Error calling function getVehicle");
    }
});


export const deleteVehicle = onRequest(async (request, response) => {
	const vehicle_id = request.body.id;
	if(!vehicle_id){
		logger.error("Missing required fields", {vehicle_id});
		response.status(404).send("Missing required fields");
		return;
	}

	try{
		await vehicle.deleteVehicle(vehicle_id);
	} catch (error){
		logger.error("Error deleting vehicle", error);
		response.status(500).send("Error calling function deleteVehicle");
	}
})


export const receiveData = onRequest(async (request, response ) => {
	const {usage, user_id, vehicle} = request.body

	if(!usage || !user_id || !vehicle){
		logger.error("Missing required fields", {usage, user_id, vehicle});
		response.status(404).send("Missing required fields")
		return;
	}

	try{
	  await data.receiveData(usage, user_id, vehicle);
	
	} catch(error) {
	  logger.error("Error calling function receiveData", error);
	  response.status(500).send("Error calling function receiveData");
 	}
});


export const retrieveHistoricalData = onRequest(async (request, response) => {
	const {startTime, endTime} = request.body;

	if(!startTime || !endTime){
		logger.error("Missing required fields", {startTime, endTime});
		response.status(404).send("Missing required fields")
		return;
	}
	
	try{
		await data.RetrieveHistoricalData(startTime, endTime);
	} catch(error){
		logger.error("Error calling function RetrieveHistoricalData", error);
		response.status(500).send("Error calling function RetrieveHistoricalData")
	}
});