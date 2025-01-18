import '@testing-library/jest-dom';
import Modal from 'react-modal';
import { jest } from '@jest/globals';

Modal.setAppElement(document.body); //This sets an app elemnt for the test modals

interface ImportMetaEnv {
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
  VITE_FIREBASE_MEASUREMENT_ID: string;
}

// This mocks `import.meta.env` for Vite variables
const importMetaEnv: ImportMetaEnv = {
  VITE_FIREBASE_API_KEY: 'test-api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'test-auth-domain',
  VITE_FIREBASE_PROJECT_ID: 'test-project-id',
  VITE_FIREBASE_STORAGE_BUCKET: 'test-storage-bucket',
  VITE_FIREBASE_MESSAGING_SENDER_ID: 'test-messaging-sender-id',
  VITE_FIREBASE_APP_ID: 'test-app-id',
  VITE_FIREBASE_MEASUREMENT_ID: 'test-measurement-id',
};

Object.defineProperty(global, 'import.meta', {
  value: {
    env: importMetaEnv,
  },
});

//This deletes mocks after test has completed
afterEach(() => {
    jest.clearAllMocks();
});

//This suppresses console logs during tests
jest.spyOn(global.console, 'log').mockImplementation(() => {});
jest.spyOn(global.console, 'error').mockImplementation(() => {});

//This mock `firebase.ts` to avoid Vite and Firebase dependencies during tests
jest.mock('../firebase', () => ({
    db: {}, // Empty db mock 
    auth: {}, //This mocks Firebase Auth as empty for tests
  }));
  
  // Mock Firestore methods and return structures to match Firestore expectations
  jest.mock('firebase/firestore', () => ({
    collection: jest.fn(() => 'mockCollection'),
    getDocs: jest.fn(() =>
      Promise.resolve({
        docs: [
          {
            id: 'mockBooking1',
            data: jest.fn(() => ({
              startTime: { toDate: () => new Date('2024-11-01T10:00:00Z') },
              endTime: { toDate: () => new Date('2024-11-01T12:00:00Z') },
            })),
          },
        ],
      })
    ),
    addDoc: jest.fn(),
    deleteDoc: jest.fn(),
    doc: jest.fn(),
  }));

// Mock global fetch
//This is for the fetch emissions call in booking page
global.fetch = jest.fn(() =>
    Promise.resolve(
      {
        ok: true,
        status: 200,
        headers: new Headers(),
        redirected: false,
        statusText: 'OK',
        type: 'default',
        url: 'http://mocked-url',
        body: null,
        bodyUsed: false,
        json: jest.fn(() => Promise.resolve({ emissions: 'mockedEmissionData' })),
        clone: jest.fn(),
        arrayBuffer: jest.fn(() => Promise.resolve(new ArrayBuffer(0))),
        blob: jest.fn(() => Promise.resolve(new Blob())),
        formData: jest.fn(() => Promise.resolve(new FormData())),
        text: jest.fn(() => Promise.resolve('mocked text')),
        bytes: jest.fn(() => Promise.resolve(new Uint8Array())),
      } as unknown as Response // Properly cast the entire object to `Response`
    )
);