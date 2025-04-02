import { CloudTasksClient } from '@google-cloud/tasks';
import { Buffer } from 'buffer';
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from "firebase-admin"
import * as functions from 'firebase-functions';
const db = admin.firestore();

const projectId = 'ev-registration-system';
const location = 'us-central1';        
const queue = 'reminders';               
const reminderUrl = 'https://sendreminder-w2ytv3mava-uc.a.run.app';
const testPhone = functions.config().twilio.test_phone;



const tasksClient = new CloudTasksClient();

export const onBookingCreated = onDocumentCreated(
    {document: 'bookings/{bookingId}', region: location}, 
    async (event) => {
  const dataSnap = event.data;
  
  if (!dataSnap) {
    console.log("Error: invalid booking data for reminder.");
    return;
  }
  
  const data = dataSnap.data();
  const { endTime, startTime, userId } = data;
  console.log("received id: " + userId);
  const sessionStartDate = startTime.toDate ? startTime.toDate() : new Date(startTime);
  const reminderTime = new Date(sessionStartDate.getTime() - 15 * 60 * 1000);
  const destNum = testPhone;
  
  const payload = JSON.stringify({
    startTime,
    endTime,
    destNum
  });
  
  const task = {
    httpRequest: {
      httpMethod: "POST" as const,
      url: reminderUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      body: Buffer.from(payload).toString('base64')
    },
    scheduleTime: {
      seconds: Math.floor(reminderTime.getTime() / 1000),
      nanos: 0,
    }
  };

  const parent = tasksClient.queuePath(projectId, location, queue);

  try {
    // Create the Cloud Task.
    const [response] = await tasksClient.createTask({ parent, task });
    console.log(`Cloud Task created: ${response.name}`);
  } catch (error) {
    console.error('Error creating Cloud Task:', error);
  }
});







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

    //const result = await addDoc(collection(db, 'messages'), message);
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
    const msg = {
      to,
      body
    }
    const result = await db.collection('messages').add(msg);

    //const result = await addDoc(collection(db, 'messages'), message);
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

      //const result = await addDoc(collection(db, 'messages'), message);
      response.status(201).json({message: "Alert successfully sent to Campus Security", id: result});
    } catch (error){
        logger.error("Error sending message to campus security", error);
        response.status(500).send("Internal Server Error. Please Try Again Later");
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
    //const result = await addDoc(collection(db, 'messages'), message);

    res.status(201).send({ message: "Message added successfully.", messageId: result.id });
  }catch (error) {
    console.error("Error adding message:", error);
    res.status(500).send({ error: "Internal Server Error. Please try again later." });
}
}); 