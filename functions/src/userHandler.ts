import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

export interface User {
    id?: string;
    username: string;
    email: string;
    phone?: string;
    role: string;
}

//Cloud function to add a user to Firestore, this function runs when a new user signs in.
export const addUser = onRequest({ cors: true }, async (req, res) => {
    try {
        const { userId, username, email, role, phone} = req.body;

        if (!userId || !username || !email) {
            console.error("Missing required fields:", { userId, username, email, role });
            res.status(400).json({ error: "Missing required fields." });
            return;
        }

        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            console.log("User already exists in Firestore:", userDoc.data());
            res.status(200).json({ message: "User already exists" });
            return;
        }

        const userData = {
            username,
            email,
            role: "user", //Deafualt role
            phone: phone ?? null,
        };

        await userRef.set(userData);

        res.status(201).json({ message: "User added successfully." });
    } catch (error) {
        logger.error("Error adding user:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

//Cloud function to fetch user details by userId.
export const getUser = onRequest({ cors: true }, async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            res.status(400).json({ error: "Missing userId parameter." });
            return;
        }

        const userRef = db.collection("users").doc(userId as string);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        res.status(200).json(userDoc.data());
    } catch (error) {
        logger.error("Error retrieving user:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});
