/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import admin from 'firebase-admin';

admin.initializeApp();
const db = getFirestore();

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

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
