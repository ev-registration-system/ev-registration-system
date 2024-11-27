import '@testing-library/jest-dom';
import Modal from 'react-modal';
import { jest } from '@jest/globals';

Modal.setAppElement(document.body); //This sets an app elemnt for the test modals

//This mocks `import.meta.env` for Vite variables
(global as any).importMetaEnv = {
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
    env: (global as any).importMetaEnv,
  },
});

//This mock `firebase.ts` to avoid Vite and Firebase dependencies during tests
// Mock `firebase.ts` to avoid actual Firebase dependencies during tests
jest.mock('../firebase', () => ({
    db: {}, // Empty db mock as a placeholder for potential mocks
    auth: {}, // Mock Firebase Auth as empty for tests
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
/*global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ emissions: 'mockedEmissionData' }),
      headers: new Headers(),
      redirected: false,
      statusText: 'OK',
      type: 'default',
      url: 'http://mocked-url',
      body: null,
      bodyUsed: false,
      clone: jest.fn(),
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
    } as Response) // Ensure the return type matches the Response interface
);*/

// Log initialization
console.log('Mock Firebase and Firestore initialized');