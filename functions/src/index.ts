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
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import admin from 'firebase-admin';

admin.initializeApp();
const db = getFirestore();

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

        if (!startTime || !endTime) {
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
            endTime: endTs
        };

        const result = await db.collection('bookings').add(booking);
        logger.info("Successfully added booking.", { result })
        res.status(201).send({ message: "Booking added successfully.", booking: result });
    } catch (error) {
        logger.error("Error adding booking:", error);
        res.status(500).send({ error: "Internal Server Error. Please try again later." });
    }
});
