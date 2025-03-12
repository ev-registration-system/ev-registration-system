import * as functions from 'firebase-functions';
import { CloudTasksClient } from '@google-cloud/tasks';
import { Buffer } from 'buffer';
import {onRequest} from "firebase-functions/v2/https";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

const project = process.env.GCP_PROJECT; // or your project id
const location = 'us-central1';          // your Cloud Tasks location
const queue = 'my-queue';                // the name of your Cloud Tasks queue
const reminderUrl = 'https://<REGION>-<PROJECT_ID>.cloudfunctions.net/sendReminder'; // endpoint for sendReminder
const testPhone = "15068382586"
const db = getFirestore();

const tasksClient = new CloudTasksClient();








export const sendReceipt = onRequest(async (req, res) => {
  try {
    const {sessionStart, sessionEnd, price, destNum} = req.body;

    if (!sessionStart || !sessionEnd || !price || !destNum) {
      res.status(400).send({ error: "Invalid input. 'sessionStart', 'sessionEnd', 'price', and 'destNum' fields are required." });
      return;
    }

    //const to = destNum;
    const to  = testPhone;
    const body = "Your session from " + sessionStart + " to " + sessionEnd + " has ended.\nAmount due: $" + price + " CAD\nProceed to pay at XYZ Location";
    const message = {
      to,
      body
    }

    const result = await db.collection('messages').add(message);
    res.status(201).send({ message: "Message added successfully.", messageId: result.id });
  }catch (error) {
    console.error("Error adding message:", error);
    res.status(500).send({ error: "Internal Server Error. Please try again later." });
}
}); 

export const sendMessage = onRequest(async (req, res) => {
  try {
    const {body, destNum} = req.body;

    if (!body || !destNum) {
      res.status(400).send({ error: "Invalid input. 'body' and 'destNum' fields are required." });
      return;
    }

    //const to = destNum;
    const to  = testPhone;
    const message = {
      to,
      body
    }

    const result = await db.collection('messages').add(message);
    res.status(201).send({ message: "Message added successfully.", messageId: result.id });
  }catch (error) {
    console.error("Error adding message:", error);
    res.status(500).send({ error: "Internal Server Error. Please try again later." });
}
}); 

export const sendReminder = onRequest(async (req, res) => {
  try {
    const {sessionStart, sessionEnd, destNum} = req.body;

    if (!sessionStart || !sessionEnd || !destNum) {
      res.status(400).send({ error: "Invalid input. 'sessionStart', 'sessionEnd', and 'destNum' fields are required." });
      return;
    }

    //const to = destNum;
    const to  = testPhone;
    const now = new Date().getTime();

    const body = "REMINDER: Your reservation from " + sessionStart + " to " + sessionEnd +
                 "Will begin in: " + (sessionStart - now) + " minutes."
    const message = {
      to,
      body
    }

    const result = await db.collection('messages').add(message);
    res.status(201).send({ message: "Message added successfully.", messageId: result.id });
  }catch (error) {
    console.error("Error adding message:", error);
    res.status(500).send({ error: "Internal Server Error. Please try again later." });
}
}); 


export const sendAlertToCampusSecurity = onRequest(async (request, response) => {
    const body = "SECURITY ALERT: Car parked at charger for more than 5 minutes without charging."
    const to = testPhone;
    const message = {
      to,
      body
    }

    try{
        const result = await db.collection('messages').add(message);
        response.status(201).json({message: "Alert successfully sent to Campus Security", id: result});
    } catch (error){
        logger.error("Error sending message to campus security", error);
        response.status(500).send("Internal Server Error. Please Try Again Later");
    }
});