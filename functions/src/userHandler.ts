import * as admin from "firebase-admin"
import * as logger from "firebase-functions/logger"

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore()

export interface User{
    id?: string;
    username: string;
    password: string;
    email: string;
    phone: number;
}

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

    static async addUser(user: User){
        try{
            const ref = db.collection(userHandler.COLLECTION_NAME);
            const docRef = await ref.add({
                username: user.username,
                password: user.password,
                email: user.email,
                phone: user.phone
            });

            const querySnapshot = await docRef.get()
            const newUser: User = {
                id: querySnapshot.id,
                ...querySnapshot.data()
            } as User;

            logger.info("User added successfully", {newUser});
            return newUser
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

    static async getUser(username: string, password: string): Promise<User | null>{
        if(!username || !password){
            throw new Error("Missing username or password");
        }
        try{
            const ref = db.collection(userHandler.COLLECTION_NAME);
            const query = ref.where("username", "==", username).where("password", "==", password);
            const querySnapshot = await query.get();
            if(querySnapshot.empty){
                return null;
            }
            const doc = querySnapshot.docs[0];
            const userRetrieved: User = {
                id: doc.id, ...doc.data()
            } as User;

            logger.info("User retrieved", {userRetrieved});
            return userRetrieved
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