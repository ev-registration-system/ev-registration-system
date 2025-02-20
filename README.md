# EVantage

# Description
EVantage is a system created to manage EV charging bookings and handle illegal parking at EV charging stations. This system is our main application, which handles users Bookings, Vehicles, Checking in and out, Payments, Real Time emission data, and User Feedback. This application follows a Serverless architecture. The application and backend are hosted through Gooogle's Firebase cloud provider, and we use serverless Cloud Functions to handle our Backend logic. Our system also communicates with a HiveMQ MQTT broker for communication to our Data Controller. Our frontend is developed using React +  typescript, so it is using Node.js. We are using `npm` as our package manager.

## Getting Started

### From the root directory run:
`npm i`
`npm run build`
`cd functions`
`npm i`
`npm run build`

### To only run React project, start in root:
`npm run dev`

### To emulate our firebase project (Cloud functions, Firestore DB, Hosting)
`cd functions`
`npm run emulate`

## System Architecture

![System Diagram](https://github.com/ev-registration-system/ev-registration-system/blob/adding-docs/docs/system-diagram.png)