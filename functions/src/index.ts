/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
//import { collection, addDoc} from 'firebase/firestore';
import * as admin from "firebase-admin"
if (!admin.apps.length) {
  admin.initializeApp();
}

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as vehicle from "./vehicleHandler";
//import * as user from "./userHandler";
import * as data from "./dataHandler";
import * as functions from "firebase-functions";
import { Timestamp } from "firebase-admin/firestore";
import { evDetected, checkInController, checkOutController } from "./pubSubHandler";

const db = admin.firestore();

export { evDetected, checkInController, checkOutController };

export const addBooking = onRequest({ cors: true }, async (req, res) => {
  try {
      //use this for debugging
      //console.log("Incoming request body:", req.body);
      const { startTime, endTime, userId, vehicleId } = req.body;

      if (req.headers.authorization) {
          const idToken = req.headers.authorization.split('Bearer ')[1];
          const decodedToken = await admin.auth().verifyIdToken(idToken);
    
          if (decodedToken.uid !== userId) {
              res.status(403).send({ error: "Unauthorized access." });
              return;
          }
      } else {
          res.status(401).send({ error: "Authentication required." });
          return;
      }

        if (!startTime || !endTime || !userId || !vehicleId) {
            res.status(400).send({ error: "Invalid input. Missing required fields." });
            return;
        }


        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date();

        // Validation logic

        // Booking cannot be made in the past
        if (start < now) {
            res.status(400).send({ error: "Invalid input. Start time cannot be in the past." });
            return;
        }

        // Booking cannot be more than a week into the future
        const oneWeekFromNow = new Date(now);
        oneWeekFromNow.setDate(now.getDate() + 7);
        if (start > oneWeekFromNow) {
            res.status(400).send({ error: "Invalid input. Start time cannot be more than a week into the future." });
            return;
        }

        // End time must be at least an hour after start time
        const minimumEndTime = new Date(start);
        minimumEndTime.setHours(start.getHours() + 1);
        if (end < minimumEndTime) {
            res.status(400).send({ error: "Invalid input. End time must be at least one hour after start time." });
            return;
        }

        // End time must not be longer than 6 hours after start time
        const maximumEndTime = new Date(start);
        maximumEndTime.setHours(start.getHours() + 6);
        if (end > maximumEndTime) {
            res.status(400).send({ error: "Invalid input. End time cannot be more than six hours after start time." });
            return;
        }

        const startTs = Timestamp.fromDate(start);
        const endTs = Timestamp.fromDate(end);

        // Query Firestore for overlapping bookings
        const overlappingBookings = await db.collection('bookings')
            .where('startTime', '<', endTs)
            .where('endTime', '>', startTs)
            .where('vehicleId', '==', vehicleId)
            .get();

        // If any bookings exist in this range then send 409 errorr
        if (!overlappingBookings.empty) {
            res.status(409).send({ error: "Booking conflict. Another booking overlaps with the requested time." });
            return;
        }

        const booking = {
            startTime: startTs,
            endTime: endTs,
            userId,
            checkedIn: false,
            vehicleId,
            validVehicle: false,
        };

        const result = await db.collection('bookings').add(booking);
        logger.info("Successfully added booking.", { result })
        res.status(201).send({ message: "Booking added successfully.", booking: result });
    } catch (error) {
        logger.error("Error adding booking:", error);
        res.status(500).send({ error: "Internal Server Error. Please try again later." });
    }
});

export const addVehicle = onRequest({ cors: true }, async (request, response) => {
  const {license, user_id, make, model, year, color} = request.body

  if (request.headers.authorization) {
    const idToken = request.headers.authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (decodedToken.uid !== user_id) {
      response.status(403).send({ error: "Unauthorized access." });
        return;
    }
  } else {
    response.status(401).send({ error: "Authentication required." });
      return;
  }

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


export const deleteVehicle = onRequest({ cors: true }, async (request, response) => {
	const {vehicle_id, user_id} = request.body

  if (request.headers.authorization) {
    const idToken = request.headers.authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.uid !== user_id) {
      response.status(403).send({ error: "Unauthorized access." });
      return;
    }
  } else {
      response.status(401).send({ error: "Authentication required." });
      return;
  }

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
		logger.error("Missing required fields", {usage, user_id, vehicle_id});
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


export const onNewSensorEntry = functions.firestore.onDocumentCreated(
 "chargers", async (event) => {
    const snapshot = event.data;
    const newData = snapshot?.data();
    
    if(newData && newData.ir_sensor == 1){
      //wait for user check-in
      //if they checkin, proceed normally
      // if(){

      // } else {
      //   var subject = "Sensor Triggered with no Check-In"
      //   var text = "Electric Vehicle Charger Sensor has been triggered at Head Hall Windsor Street Parking Lot";
      //   var data: messaging.Data = {
      //     text = text,
      //     subject = subject
      //   }
      //   sendAlertToCampusSecurity()
      // }
    }
 })
 
export const getEmissionsData = onRequest({ cors: true }, async (req, res) => {
  try {
      if (!req.headers.authorization) {
          res.status(401).json({ error: "Authentication required." });
          return;
      }

      const idToken = req.headers.authorization.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      if (!decodedToken) {
          res.status(403).json({ error: "Unauthorized access." });
          return;
      }

      console.log("User authenticated:", decodedToken.uid);

      const emissionsDoc = await db.collection("emissions").doc("3TN6YbkHSKEw4VeSL8Ur").get();

      if (!emissionsDoc.exists) {
          res.status(404).json({ error: "Emissions data not found" });
          return;
      }
      //For Debugging
      const emissionsData = emissionsDoc.data();
      //console.log("Fetched emissions document data:", emissionsData);
      const emissionsArray = emissionsData?.emissions_data || [];
      //console.log("Emissions array:", emissionsArray, "with length:", emissionsArray.length);
    
      if (!Array.isArray(emissionsArray) || emissionsArray.length !== 24) {
          res.status(400).json({ error: "Invalid emissions data format" });
          return;
      }

      const formattedData = emissionsArray.map((emissionFactor: number, hour: number) => ({
          date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
          hour: hour + 1,
          emissionFactor,
      }));

      res.status(200).json(formattedData);
  } catch (error) {
      console.error("Error fetching emissions data:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});
