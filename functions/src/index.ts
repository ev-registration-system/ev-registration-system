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
import * as vehicle from "./vehicleHandler";
import * as admin from "firebase-admin"
import * as user from "./userHandler";
import * as data from "./dataHandler";


if (!admin.apps.length) {
  admin.initializeApp();
}

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

  const newUser: user.User = {
    username: username,
    password: password,
    email: email,
    phone: phone
  }

    try{
        const userAdded: user.User = await user.addUser(newUser);
        response.status(201).json({message: "User has been created", 
          id: userAdded.id,
          username: userAdded.username,
          password: userAdded.password,
          email: userAdded.email,
          phone: userAdded.phone});
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
      const getUser = await user.getUser(username, password);
      if(!getUser){
        logger.info("User not found");
        response.status(200).send("User Not Found");
        return;
      }
      response.status(200).json({
        message: "User has been retrieved",
        username: getUser?.username,
        password: getUser?.password,
        email: getUser?.email,
        phone: getUser?.phone
      });
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

  const vehicleToAdd: vehicle.Vehicle = {
    license: license,
    user_id: user_id,
    make: make,
    model: model,
    year: year,
    color: color
  }

  try{
    const vehicleAdded = await vehicle.addVehicle(vehicleToAdd);
    response.status(201).json({message: "Vehicle has been added",
      id: vehicleAdded.id,
      license: vehicleAdded.license,
      user_id: vehicleAdded.user_id,
      make: vehicleAdded.make,
      model: vehicleAdded.model,
      year: vehicleAdded.year,
      color: vehicleAdded.color
    });
  } catch(error){
    logger.error("Error calling function addVehicle", error);
    response.status(500).send("Error calling function addVehicle");
  }
});


export const getVehicle = onRequest(async (request, response) => {
    const user_id = request.body.id as string;
    if(!user_id){
      logger.error("Missing required fields", {user_id});
      response.status(400).send("Missing required fields");
      return;
    }
    try{
        const vehicleRetrieved = await vehicle.getVehicle(user_id);
        if(!vehicleRetrieved){
          logger.info("vehicles not found");
          response.status(200).send("vehicles not found");
          return;
        }

        response.status(200).json({
          message: "Vehicles has been retrieved",
          vehicleRetrieved
        });

    } catch(error) {
        logger.error("Error calling function getVehicle", error);
        response.status(500).send("Error calling function getVehicle");
    }
});


export const deleteVehicle = onRequest(async (request, response) => {
	const vehicle_id = request.body.id;
	if(!vehicle_id){
		logger.error("Missing required fields", {vehicle_id});
		response.status(400).send("Missing required fields");
		return;
	}

	try{
		 await vehicle.deleteVehicle(vehicle_id);
     response.status(200).send("Vehicle has been deleted")
	} catch (error){
		logger.error("Error deleting vehicle", error);
		response.status(500).send("Error calling function deleteVehicle");
	}
})


export const receiveData = onRequest(async (request, response ) => {
	const {usage, user_id, vehicle_id} = request.body

	if(!usage || !user_id || !vehicle_id){
		logger.error("Missing required fields", {usage, user_id, vehicle});
		response.status(404).send("Missing required fields")
		return;
	}

  const newData: data.Data = {
    user_id: user_id,
    usage: usage,
    vehicle_id: vehicle_id,
  }

	try{
	  const dataAdded: data.Data = await data.receiveData(newData);
    response.status(201).json({
      message: "Data has been added",
      id: dataAdded.id,
      usage: dataAdded.usage,
      user_id: dataAdded.user_id,
      vehicle_id: dataAdded.vehicle_id,
      entryTime: dataAdded.entryTime
    });
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
    // const start = Timestamp.fromDate(new Date(startTime));
    // const end = Timestamp.fromDate(new Date(endTime));
    // console.log("\n\nXZXXXX" + start + "XXXXXXXXXXX" + end + "\n\n");

		const results: data.Data[] = await data.RetrieveHistoricalData(startTime, endTime);
    response.status(201).json({
      message: "Historical Data has been retrieved",
      results
    });
	} catch(error){
		logger.error("Error calling function RetrieveHistoricalData", error);
		response.status(500).send("Error calling function RetrieveHistoricalData")
	}
});