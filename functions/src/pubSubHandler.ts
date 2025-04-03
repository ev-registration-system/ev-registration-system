import { onMessagePublished } from "firebase-functions/v2/pubsub";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";
import { PubSub } from "@google-cloud/pubsub";
import {onRequest} from "firebase-functions/v2/https";

const db = admin.firestore();

const pubSubClient = new PubSub();

export const evDetected = onMessagePublished( { topic: "projects/ev-registration-system/topics/arrive", region: "us-central1", } , async (event) => {
  logger.info("Full event object:", JSON.stringify(event, null, 2));
  try {
    const msg = event.data.message.data; 
    if (!msg) {
      logger.warn("No data in this Pub/Sub message.");
      return;
    }

    const now = admin.firestore.Timestamp.now();
    const fiveMinsFromNow = new Date(now.toDate().getTime() + 5 * 60 * 1000);

    logger.info("five min from now "+fiveMinsFromNow);

    const upcomingBooking = await db.collection("bookings")
      .where("startTime", ">", now)
      .orderBy("startTime", "asc")
      .limit(1)
      .get();

    //Checks if there are any upcoming bookings
    if (upcomingBooking.empty) {
      logger.info("No upcoming bookings, Illegal vehicle.");
      try {
        const pubsubTopic = pubSubClient.topic("projects/ev-registration-system/topics/illegal");
        const messageId = await pubsubTopic.publishMessage({ data: Buffer.from("No upcoming booking") });
        console.log(`Published to Pub/Sub topic ${"projects/ev-registration-system/topics/illegal"} (ID: ${messageId})`);
      } catch (error) {
        console.error('Error publishing to Pub/Sub:', error);
      }
    }

    const [nextBookingDoc] = upcomingBooking.docs;
    const nextBookingData = nextBookingDoc.data();

    const nextBookingStart = nextBookingData.startTime.toDate();

    logger.info("next booking start "+nextBookingStart);
    logger.info(nextBookingStart <= fiveMinsFromNow);
    
    //Checks if next booking starts within 5 minutes
    if (nextBookingStart <= fiveMinsFromNow) {
      logger.info("Booking within 5 min");
      await nextBookingDoc.ref.update({ validVehicle: true });

    } else {
      logger.info("Next booking is more than 5 minutes away, Illegal vehicle");
      try {
        const pubsubTopic = pubSubClient.topic("projects/ev-registration-system/topics/illegal");
        const messageId = await pubsubTopic.publishMessage({ data: Buffer.from("Next booking is more than 5 minutes away") });
        console.log(`Published to Pub/Sub topic ${"projects/ev-registration-system/topics/illegal"} (ID: ${messageId})`);
      } catch (error) {
        console.error('Error publishing to Pub/Sub:', error);
      }
    }

  } catch (error) {
    logger.error("Error processing Pub/Sub message from MQTT:", error);
  }
});

export const checkInController = onRequest({ cors: true }, async (req, res) => {
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

    try {
      const pubsubTopic = pubSubClient.topic("projects/ev-registration-system/topics/check-in");
      const messageId = await pubsubTopic.publishMessage({ data: Buffer.from("User has checked in") });
      console.log(`Published to Pub/Sub topic ${"projects/ev-registration-system/topics/checked-in"} (ID: ${messageId})`);
      res.status(201).send({ message: "Successfully checked in." });
    } catch (error) {
      console.error('Error publishing to Pub/Sub:', error);
      res.status(500).json({ error: "Error publishing to Pub/Sub" });
    }
  } catch (error) {
      console.error("Error checking in", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

export const userCheckout = onRequest({ cors: true }, async (req, res) => {
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

    try {
      const pubsubTopic = pubSubClient.topic("projects/ev-registration-system/topics/checkout");
      const messageId = await pubsubTopic.publishMessage({ data: Buffer.from("User has checked out") });
      console.log(`Published to Pub/Sub topic ${"projects/ev-registration-system/topics/checkedout"} (ID: ${messageId})`);
      res.status(201).send({ message: "Successfully checked out." });
    } catch (error) {
      console.error('Error publishing to Pub/Sub:', error);
      res.status(500).json({ error: "Error publishing to Pub/Sub" });
    }
  } catch (error) {
      console.error("Error checking out:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

export const checkOutController = onMessagePublished({ topic: "projects/ev-registration-system/topics/leave", region: "us-central1", }, async (event) => {
  logger.info("Received checkout Pub/Sub event:", JSON.stringify(event, null, 2));

  try {
    const msg = event.data.message.data; 
    if (!msg) {
      logger.warn("No data in this Pub/Sub message.");
      return;
    }

    const now = admin.firestore.Timestamp.now();
    const snapshot = await db
      .collection("bookings")
      .where("checkedIn", "==", true)
      .where("endTime", ">", now)
      .orderBy("endTime", "asc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      logger.info("No currently-checked-in booking found. Nothing to check out.");
      return;
    }

    const [doc] = snapshot.docs;
    await doc.ref.update({ checkedIn: false });
    logger.info(`Booking ${doc.id} updated: checkedIn = false`);
    try {
      const pubsubTopic = pubSubClient.topic("projects/ev-registration-system/topics/checkout");
      const messageId = await pubsubTopic.publishMessage({ data: Buffer.from("User has checked out.") });
      console.log(`Published to Pub/Sub topic ${"projects/ev-registration-system/topics/checkout"} (ID: ${messageId})`);
    } catch (error) {
      console.error('Error publishing to Pub/Sub:', error);
    }

  } catch (error) {
    logger.error("Error processing checkout Pub/Sub message:", error);
  }
});

export const recieveSummary = onMessagePublished({ topic: "projects/ev-registration-system/topics/summary", region: "us-central1", }, async (event) => {
  logger.info("Received checkout Pub/Sub event:", JSON.stringify(event, null, 2));

  try {
    const msg = event.data.message.data; 
    if (!msg) {
      logger.warn("No data in this Pub/Sub message.");
      return;
    }

    const decodedString = Buffer.from(msg, "base64").toString();
    const payload = JSON.parse(decodedString);
    const parsedPayload = JSON.parse(payload.message);
    logger.info(parsedPayload);
    
    const summary = {
      chargerId: parsedPayload.charger_id,
      startTime: parsedPayload.start_time,
      endTime: parsedPayload.end_time,
      hoursCharged: parsedPayload.hours_charged,
      sessionEnergy: parsedPayload.session_energy,
    };

    await db.collection('session_summaries').add(summary);

  } catch (error) {
    logger.error("Error processing checkout Pub/Sub message:", error);
  }
});