import * as logger from "firebase-functions/logger"
import functions from "firebase-functions";
import nodemailer from "nodemailer";
import * as admin from "firebase-admin";

const stmpEmail = functions.config().stmp.email;
const stmpPass = functions.config().stmp.password;

export interface Data{
    text: string,
    subject: string
};

const transporter = nodemailer.createTransport({
    host: "stmp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: stmpEmail,
        pass: stmpPass
    }
});

if(!admin.apps.length){
    admin.initializeApp();
}

const db = admin.firestore()

class MeessagingSystem{
    private static COLLECTION_MESSAGES = "messages"

    static async sendAlertToCampusSecurity(request: Data, method: string){
        if(method == "message"){
            try{
                var to = "+15068382586" //change to campus security number
                return this.sendMessage(to, request.text);
            } catch(error){
                logger.error("Error sending alert message to campus security", error);         
                throw new Error("Error sending alert message to campus security")
            }
        } else {
            try{
                var recipient = "ealalam@unb.ca" //for now
                return this.sendEmail(recipient, request.subject, request.text);
            } catch (error){
                console.error("Unable to send Email to campus security", error);
                throw new Error("Unable to send Email to campus security");
            }
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


    private static async sendEmail(recipient: string, subject: string, text: string){
        const mailOptions = {
            from: stmpEmail,
            to: recipient,
            subject: subject,
            text: text
        };

        try{
            await transporter.sendMail(mailOptions);
            // return {success: true, message: "message successfully sent!"};
        } catch (error){
            console.error("Error sending email", error);
            // return {success: false, message: "Failed to send email"};]
            throw new Error("Unable to send Email");
        }
    }

}

export const sendAlertToCampusSecurity = MeessagingSystem.sendAlertToCampusSecurity;
export const sendAlertToOwner = MeessagingSystem.sendAlertToOwner;
export const sendAlertToSystem = MeessagingSystem.sendAlertToSystem;