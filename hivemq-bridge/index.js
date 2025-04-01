require('dotenv').config();
const express = require('express');
const mqtt = require('mqtt');
const { PubSub } = require('@google-cloud/pubsub');

const pubSubClient = new PubSub({
  projectId: 'ev-register-system',
  keyFilename: './ev-registration-system-firebase.json',
});

const connectUrl = `mqtts://${process.env.HIVEMQ_HOST}:${process.env.HIVEMQ_PORT}`;
console.log(`Connecting to HiveMQ broker at: ${connectUrl}`);

const mqttOptions = {
  username: process.env.HIVEMQ_USERNAME,
  password: process.env.HIVEMQ_PASSWORD,
  keepalive: 30,
};

const client = mqtt.connect(connectUrl, mqttOptions);

const MQTT_TOPICS = [
  '/evantage/system/arrive',
  '/evantage/system/leave'
];

const MQTT_TO_PUB_TOPIC_MAP = {
  [MQTT_TOPICS[0]]: process.env.PUB_BASE_TOPIC + '/arrive',
  [MQTT_TOPICS[1]]: process.env.PUB_BASE_TOPIC + '/leave',
};

client.on('connect', () => {
  console.log('Connected to HiveMQ broker');
  client.subscribe(MQTT_TOPICS, (err) => {
    if (err) {
      console.error('MQTT subscribe error:', err);
    } else {
      console.log(`Subscribed to MQTT topics: ${MQTT_TOPICS.join(', ')}`);
    }
  });
});

client.on('error', (err) => {
  console.error('MQTT connection error:', err);
});

client.on('message', async (topic, messageBuffer) => {
  const message = messageBuffer.toString();
  console.log(`Received from MQTT topic ${topic}: ${message}`);

  const pubsubTopicName = MQTT_TO_PUB_TOPIC_MAP[topic];
  if (!pubsubTopicName) {
    console.log(`No matching Pub/Sub topic for: ${topic}`);
    return;
  }

  const dataBuffer = Buffer.from(JSON.stringify({
    sourceTopic: topic,
    message,
    receivedAt: new Date().toISOString(),
  }));

  try {
    const pubsubTopic = pubSubClient.topic(pubsubTopicName);
    const messageId = await pubsubTopic.publishMessage({ data: dataBuffer });
    console.log(`Published to Pub/Sub topic ${pubsubTopicName} (ID: ${messageId})`);
  } catch (error) {
    console.error('Error publishing to Pub/Sub:', error);
  }
});

const SUB_TOPICS = [
  process.env.SUB_BASE_TOPIC + '/check-in-sub',
  process.env.SUB_BASE_TOPIC + '/checkout-sub',
  process.env.SUB_BASE_TOPIC + '/illegal-sub'
];

const PUBSUB_TO_MQTT_TOPIC_MAP = {
  [SUB_TOPICS[0]]: '/evantage/controller/check-in',
  [SUB_TOPICS[1]]: '/evantage/controller/checkout',
  [SUB_TOPICS[2]]: '/evantage/controller/illegal'
};

SUB_TOPICS.forEach((topicName) => {
  const subscription = pubSubClient.subscription(`${topicName}`);
  console.log(`Subscribed to Pub/Sub topic "${topicName}"`);
  subscription.on('message', (message) => {
    const dataString = message.data.toString();
    console.log(`Received from Pub/Sub topic "${topicName}": ${dataString}`);
    message.ack();

    const mqttTopic = PUBSUB_TO_MQTT_TOPIC_MAP[topicName];

    client.publish(mqttTopic, dataString, {}, (err) => {
      if (err) {
        console.error(`Error publishing to MQTT topic "${mqttTopic}":`, err);
      } else {
        console.log(`Forwarded message to MQTT topic "${mqttTopic}": ${dataString}`);
      }
    });
  });

  subscription.on('error', (err) => {
    console.error(`Subscription error for topic "${topicName}":`, err);
  });
});

const app = express();
app.get('/', (req, res) => {
  res.send('HiveMQ Bridge is running.');
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Bridge listening on port ${PORT}`);
});
