import { onMessagePublished } from "firebase-functions/v2/pubsub";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const evDetected = onMessagePublished("evantage", async (event) => {
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
      //client.publish("evantage/system/illegalvehicle", "No upcoming booking");
      return;
    }

    const [nextBookingDoc] = upcomingBooking.docs;
    const nextBookingData = nextBookingDoc.data();

    const nextBookingStart = nextBookingData.startTime.toDate();
    
    //Checks if next booking starts within 5 minutes
    if (nextBookingStart <= fiveMinsFromNow) {
      logger.info("Booking within 5 min => Enable check-in button or handle logic here.");

      // Example: store a flag in Firestore or call some function
      // e.g. db.collection("someCollection").doc("UIState").set({ canCheckIn: true });

    } else {
      logger.info("Next booking is more than 5 minutes away => illegal vehicle");
    }

  } catch (error) {
    logger.error("Error processing Pub/Sub message from MQTT:", error);
  }
});