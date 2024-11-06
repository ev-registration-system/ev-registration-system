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
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();
const corsHandler = cors({ origin: true }); // Allow all origins

export const updateBooking = functions.https.onRequest((request, response) => {
    // Use the CORS handler
    corsHandler(request, response, async () => {
        if (request.method !== "POST") {
            response.status(405).send({ error: "Method not allowed. Use POST." });
            return;
        }

        const { bookingId, newStartTime, newEndTime } = request.body;

        if (!bookingId || !newStartTime || !newEndTime) {
            response.status(400).send({
                success: false,
                message: "The request must include bookingId, newStartTime, and newEndTime.",
            });
            return;
        }

        const startTime = admin.firestore.Timestamp.fromDate(new Date(newStartTime));
        const endTime = admin.firestore.Timestamp.fromDate(new Date(newEndTime));

        try {
            const bookingRef = db.collection("bookings").doc(bookingId);
            await bookingRef.update({ startTime, endTime });
            response.send({ success: true, message: "Booking updated successfully." });
        } catch (error) {
            console.error("Error updating booking:", error);

            const errorMessage = (error as Error).message;
            response.status(500).send({
                success: false,
                message: "Failed to update booking.",
                error: errorMessage,
            });
        }
    });
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
