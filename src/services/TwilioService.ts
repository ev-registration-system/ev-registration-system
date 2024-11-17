// src/TwilioService.ts
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export const sendSms = async (to: string, body: string): Promise<void> => {
  try {
    const message = await client.messages.create({
      body,
      from: fromPhoneNumber,
      to,
    });
    console.log(`Message sent: ${message.sid}`);
  } catch (error) {
    console.error(`Failed to send SMS: ${error}`);
  }
};
