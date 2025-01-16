import * as admin from "firebase-admin"
import * as logger from "firebase-functions/logger"

if(!admin.apps.length){
    admin.initializeApp();
}

const db = admin.firestore()

class MeessagingSystem{
    private static COLLECTION_MESSAGES = "messages"

    static async sendAlertToCampusSecurity(body: string){
        try{
            var to = "+15068382586" //change to campus security number
            return this.sendMessage(to, body);
        } catch(error){
            logger.error("Error sending alert message to campus security", error);         
            throw new Error("Error sending alert message to campus security")
        }
    }

    static async sendAlertToOwner(body: string){
        try{
            var to = "+15068382586" //change to user number
            return this.sendMessage(to, body);
        } catch(error){
            logger.error("Error sending alert message to owner", error);
            throw new Error("Error sending message to owner")
        }
    }

    static async sendAlertToSystem(body: string){
        try{
            var to = "+15068382586" //change to system number
            return this.sendMessage(to, body);
        } catch(error){
            logger.error("Error sending alert message to system admin", error);
            throw new Error("Error sending message to system admin");
        }
    }


    /*MESSAGE FUNCTION*/
    private static async sendMessage(to: string, body: string){
        const message = {
            to,
            body
        };
        const result = await db.collection(this.COLLECTION_MESSAGES).add(message);
        return result.id
    } catch(error: any){
         console.error("Error adding message: ", error);
         return{status: 500};
    }
}

export const sendAlertToCampusSecurity = MeessagingSystem.sendAlertToCampusSecurity;
export const sendAlertToOwner = MeessagingSystem.sendAlertToOwner;
export const sendAlertToSystem = MeessagingSystem.sendAlertToSystem;