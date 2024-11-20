import { onRequest } from "firebase-functions/https";
import * as admin from "firebase-admin"
import * as logger from "firebase-functions/logger"

const db = admin.firestore()

class userHandler{
    private static COLLECTION_NAME = "users"

    static addUser = onRequest(async (request, response) => {
        logger.info("add User function triggered", {structuredData: true});

        const {username, password, email} = request.body

        if(!username || !password || !email){
            logger.error("Missing required fields", {username, password, email});
            response.status(404).send("Missing required fields")
            return;
        }

        try{
            const ref = db.collection(userHandler.COLLECTION_NAME);
            await ref.add({
                username: username,
                password: password,
                email: email
            });
            logger.info("User added successfully", {username, password, email});
            response.status(200).send("User added successfully");
        } catch(error){
            logger.error("Error adding user", error);
            response.status(500).send("Error adding user");
        }
    });

    
    static getUser = onRequest(async (request, response) => {
        const user_id = request.query.id as string;
        if(!user_id){
            logger.error("Missing user ID in query parameters");
            response.status(400).send("Missing user ID");
            return;
        }
        try{
            const ref = db.collection(userHandler.COLLECTION_NAME);
            const query = ref.where("user_id", "==", user_id);
            const querySnapchot = await query.get();

            logger.info("User retrived", {user_id, querySnapchot});
            response.status(200).json(querySnapchot);
        } catch(error){
            logger.error("Error retrieving user", error);
            response.status(500).send("Error retrieving users");
        }
    });
}

export const addUser = userHandler.addUser;
export const getUser = userHandler.getUser;