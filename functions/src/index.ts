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
//import * as user from "./userHandler";
import * as data from "./dataHandler";
//import * as messaging from "./MessagingSystem";
import * as functions from "firebase-functions";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const db = getFirestore()

if (!admin.apps.length) {
    admin.initializeApp();
}

export const addBooking = onRequest(async (req, res) => {
  try {
      const { startTime, endTime, userId } = req.body;

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

        if (!startTime || !endTime || !userId) {
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
        };

        const result = await db.collection('bookings').add(booking);
        logger.info("Successfully added booking.", { result })
        res.status(201).send({ message: "Booking added successfully.", booking: result });
    } catch (error) {
        logger.error("Error adding booking:", error);
        res.status(500).send({ error: "Internal Server Error. Please try again later." });
    }
});

export const sendMessage = onRequest(async (req, res) => {
    try {
        // Extract 'to' and 'body' fields from the request body
        const { to, body } = req.body;

        // Basic validation to ensure required fields are provided
        if (!to || !body) {
            res.status(400).send({ error: "Invalid input. 'to' and 'body' fields are required." });
            return;
        }

        // Create a new message object
        const message = {
            to,
            body
        };

        // Add the message to the 'messages' collection in Firestore
        const result = await db.collection('messages').add(message);
        res.status(201).send({ message: "Message added successfully.", messageId: result.id });
    } catch (error) {
        console.error("Error adding message:", error);
        res.status(500).send({ error: "Internal Server Error. Please try again later." });
    }
});

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


// export const sendAlertToCampusSecurity = onRequest(async (request, response) => {
//     const {body, subject, method} = request.body;
//     if(!body || !subject){
//         logger.error("Missing required fields");
//         response.status(400).send("Missing required fields")
//     }

//     const data: messaging.Data = {
//       text: body,
//       subject: subject
//     }

//     try{
//         const result = await messaging.sendAlertToCampusSecurity(data, method);
//         response.status(201).json({message: "Alert successfully sent to Campus Security", id: result});
//     } catch (error){
//         logger.error("Error sending message to campus security", error);
//         response.status(500).send("Internal Server Error. Please Try Again Later");
//     }
// });

// export const sendAlertToOwner = onRequest(async (request, response) => {
//     const {body} = request.body;
//     if(!body){
//         logger.error("Missing required fields");
//         response.status(400).send("Missing required fields")
//     }
//     try{
//         const result = await messaging.sendAlertToOwner(body);
//         response.status(201).json({message: "Alert successfully sent to Campus Security", id: result});
//     } catch (error){
//         logger.error("Error sending message to Owner", error);
//         response.status(500).send("Internal Server Error. Please Try Again Later");
//     }
// });

// export const sendAlertToSystem = onRequest(async (request, response) => {
//     const {body} = request.body;
//     if(!body){
//         logger.error("Missing required fields");
//         response.status(400).send("Missing required fields")
//     }
//     try{
//         const result = await messaging.sendAlertToSystem(body);
//         response.status(201).json({message: "Alert successfully sent to System Administration", id: result});
//     } catch (error){
//         logger.error("Error sending message to campus security", error);
//         response.status(500).send("Internal Server Error. Please Try Again Later");
//     }
// });

// export const addUser = onRequest(async (request, response) => {
//   const {username, email, phone} = request.body;
//   if(!username || !email || !phone){
//     logger.error("Missing required fields", {username, email, phone});
//     response.status(404).send("Missing required fields");
//   }

//   const newUser: user.User = {
//     username: username,
//     email: email,
//     phone: phone
//   }

//     try{
//         const userAdded: user.User = await user.addUser(newUser);
//         response.status(201).json({message: "User has been created", 
//           id: userAdded.id,
//           username: userAdded.username,
//           email: userAdded.email,
//           phone: userAdded.phone});
//     } catch(error){
//         logger.error("Error calling function addUser", error);
//         response.status(500).send("Error calling function addUser");
//     }
// });


// export const getUser = onRequest(async (request, response) => {
//   const {username, password} = request.body;
//   if(!username || !password){
//     logger.error("Missing required fields", {username, password});
//     response.status(404).send("Missing required fields");
//   }
//     try{
//       const getUser = await user.getUser(username);
//       if(!getUser){
//         logger.info("User not found");
//         response.status(200).send("User Not Found");
//         return;
//       }
//       response.status(200).json({
//         message: "User has been retrieved",
//         username: getUser?.username,
//         email: getUser?.email,
//         phone: getUser?.phone
//       });
//     } catch (error) {
//         logger.error("Error calling function getUser", error);
//         response.status(500).send("Error calling function getUser");
//     }
// });


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


// export const getVehicle = onRequest(async (request, response) => {
//     const user_id = request.body.id as string;
//     if(!user_id){
//       logger.error("Missing required fields", {user_id});
//       response.status(400).send("Missing required fields");
//       return;
//     }
//     try{
//         const vehicleRetrieved = await vehicle.getVehicle(user_id);
//         if(!vehicleRetrieved){
//           logger.info("vehicles not found");
//           response.status(200).send("vehicles not found");
//           return;
//         }

//         response.status(200).json({
//           message: "Vehicles has been retrieved",
//           vehicleRetrieved
//         });

//     } catch(error) {
//         logger.error("Error calling function getVehicle", error);
//         response.status(500).send("Error calling function getVehicle");
//     }
// });


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
 
export const getEmissionsData = onRequest(async (req, res) => {
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
