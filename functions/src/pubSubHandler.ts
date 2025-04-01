import { onMessagePublished } from "firebase-functions/v2/pubsub";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";
import { PubSub } from "@google-cloud/pubsub";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const PUB_BASE_TOPIC="projects/ev-registration-system/topics";
//const SUB_BASE_TOPIC="projects/ev-registration-system";

const pubSubClient = new PubSub();

export const evDetected = onMessagePublished( { topic: "projects/ev-registration-system/topics/arrive", region: "us-central1", } , async (event) => {
  try {
    const msg = event.data.message.data; 
    if (!msg) {
      logger.warn("No data in this Pub/Sub message.");
      return;
    }

    const decodedString = Buffer.from(msg, "base64").toString();
    const payload = JSON.parse(decodedString);

    logger.info("Received MQTT→PubSub message:", payload);

    const now = admin.firestore.Timestamp.now();
    const fiveMinsFromNow = new Date(now.toDate().getTime() + 5 * 60 * 1000);

    const upcomingBooking = await db.collection("bookings")
      .where("startTime", ">", now)
      .orderBy("startTime", "asc")
      .limit(1)
      .get();

    //Checks if there are any upcoming bookings
    if (upcomingBooking.empty) {
      logger.info("No upcoming bookings = Illegal vehicle.");
      await pubSubClient.topic(PUB_BASE_TOPIC + "/illegal").publishMessage({
        data: Buffer.from("No upcoming booking"),
      });
      return;
    }

    const [nextBookingDoc] = upcomingBooking.docs;
    const nextBookingData = nextBookingDoc.data();

    const nextBookingStart = nextBookingData.startTime.toDate();
    
    //Checks if next booking starts within 5 minutes
    if (nextBookingStart <= fiveMinsFromNow) {
      logger.info("Booking within 5 min");
      await nextBookingDoc.ref.update({ validVehicle: true });

    } else {
      logger.info("Next booking is more than 5 minutes away => illegal vehicle");
      await pubSubClient.topic(PUB_BASE_TOPIC + "/illegal").publishMessage({
        data: Buffer.from("No scheduled booking within 5 minutes"),
      });
    }

  } catch (error) {
    logger.error("Error processing Pub/Sub message from MQTT:", error);
  }
});