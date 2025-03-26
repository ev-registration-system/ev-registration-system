const express = require('express');
const mqtt = require('mqtt');

const {
  HIVEMQ_HOST = '0a4d1c24e0a84a2c982410aa6a859838.s1.eu.hivemq.cloud',
  HIVEMQ_PORT = '8883',
  HIVEMQ_USERNAME = '',
  HIVEMQ_PASSWORD = '',
  MQTT_TOPIC = 'evantage/system/#',
  PUBSUB_TOPIC = 'projects/ev-registration-system/topics/evantage',
} = process.env;

const pubSubClient = new PubSub();

const connectUrl = `mqtt://${HIVEMQ_HOST}:${HIVEMQ_PORT}`;
console.log(`Connecting to HiveMQ broker at: ${connectUrl}`);

const mqttOptions = {
  username: HIVEMQ_USERNAME,
  password: HIVEMQ_PASSWORD,
  keepalive: 30,
};

const client = mqtt.connect(connectUrl, mqttOptions);

client.on('connect', () => {
  console.log('Connected to HiveMQ broker');
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error('MQTT subscribe error:', err);
    } else {
      console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
    }
  });
});

client.on('error', (err) => {
  console.error('MQTT connection error:', err);
});

client.on('message', async (topic, messageBuffer) => {
    const message = messageBuffer.toString();
    console.log(`Received on "${topic}": ${message}`);
  
    const payload = {
      topic,
      message,
      receivedAt: new Date().toISOString(),
    };
    const dataBuffer = Buffer.from(JSON.stringify(payload));
  
    try {
      const messageId = await pubSubClient.topic(PUBSUB_TOPIC).publish(dataBuffer);
      console.log(`Published to Pub/Sub (ID: ${messageId})`);
    } catch (error) {
      console.error('Error publishing to Pub/Sub:', error);
    }
  });

const app = express();
app.get('/', (req, res) => {
  res.send('HiveMQ Bridge is running.');
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Bridge listening on port ${PORT}`);
});
