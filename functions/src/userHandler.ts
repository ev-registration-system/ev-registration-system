import { onRequest } from "firebase-functions/https";
import * as admin from "firebase-admin"
import * as logger from "firebase-functions/logger"

const db = admin.firestore()

class userHandler{
    private static COLLECTION_NAME = "users"

    // static addUser = onRequest(async (request, response) => {
    //     logger.info("add User function triggered", {structuredData: true});

    //     const {username, password, email, phone} = request.body

    //     if(!username || !password || !email || !phone){
    //         logger.error("Missing required fields", {username, password, email, phone});
    //         response.status(404).send("Missing required fields")
    //         return;
    //     }

    //     try{
    //         const ref = db.collection(userHandler.COLLECTION_NAME);
    //         await ref.add({
    //             username: username,
    //             password: password,
    //             email: email,
    //             phone: phone
    //         });
    //         logger.info("User added successfully", {username, password, email, phone});
    //         response.status(200).send("User added successfully");
    //     } catch(error){
    //         logger.error("Error adding user", error);
    //         response.status(500).send("Error adding user");
    //     }
    // });

    static async addUser(username: string, password: string, email: string, phone: number){
        if(!username || !password || !email || !phone){
            throw new Error("Missing required fields")
        }
        try{
            const ref = db.collection(userHandler.COLLECTION_NAME);
            await ref.add({
                username: username,
                password: password,
                email: email,
                phone: phone
            });
            logger.info("User added successfully", {username, password, email, phone});
            return true
        } catch (error) {
            logger.error("Error adding user", error);
            throw new Error("Error adding user");
        }
    }

    
    // static getUser = onRequest(async (request, response) => {
    //     const user_id = request.query.id as string;
    //     if(!user_id){
    //         logger.error("Missing user ID in query parameters");
    //         response.status(400).send("Missing user ID");
    //         return;
    //     }
    //     try{
    //         const ref = db.collection(userHandler.COLLECTION_NAME);
    //         const query = ref.where("user_id", "==", user_id);
    //         const querySnapchot = await query.get();

    //         logger.info("User retrived", {user_id, querySnapchot});
    //         response.status(200).json(querySnapchot);
    //     } catch(error){
    //         logger.error("Error retrieving user", error);
    //         response.status(500).send("Error retrieving users");
    //     }
    // });

    static async getUser(username: string, password: string){
        if(!username || !password){
            throw new Error("Missing username or password");
        }
        try{
            const ref = db.collection(userHandler.COLLECTION_NAME);
            const query = ref.where("username", "==", username).where("password", "==", password);
            const querySnapshot = await query.get();
            if(querySnapshot.empty){
                return false;
            }
            
            logger.info("User retrieved", {querySnapshot});
            return querySnapshot.docs
        } catch (error){
            logger.error("Error retrieving user", error);
            throw new Error("Error retrieving user");
        }

    }

    // static checkIfUserElseAdd = onRequest(async (request, response) => {
    //     const user_id = request.query.id as string;
    //     if(!user_id){
    //         logger.error("Missing user ID in query parameters");
    //         response.status(400).send("Missing user ID");
    //         return;
    //     }
    //     try{
    //         const ref = db.collection(userHandler.COLLECTION_NAME);
    //         const query = ref.where("user_id", "==", user_id);
    //         const querySnapchot = await query.get();
    //         if(querySnapchot.empty){
    //             logger.info("User not found. Adding user");
                
    //         }
    //     }
    // });
}

export const addUser = userHandler.addUser;
export const getUser = userHandler.getUser;