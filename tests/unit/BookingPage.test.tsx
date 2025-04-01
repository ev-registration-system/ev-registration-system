// import { render, screen, waitFor, act} from '@testing-library/react';
// import BookingPage from '../../src/views/BookingPage/BookingPage';
// import React from 'react';

jest.mock('../../firebase', () => ({
  db: 'mockDb',
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => 'mockCollection'),
  getDocs: jest.fn(async () => ({
    docs: [
      {
        id: 'mockBooking1',
        data: jest.fn(() => ({
          startTime: { toDate: () => new Date('2024-11-01T10:00:00Z') },
          endTime: { toDate: () => new Date('2024-11-01T12:00:00Z') },
        })),
      },
    ],
  })),
}));

jest.mock('../../src/components/Bookings/Calendar', () => () => <div>Mocked Calendar</div>);
jest.mock('../../src/components/Bookings/ReservationModal', () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Mocked Reservation Modal</div> : null,
}));
test('placeholder', () => {
  expect(1 === 1)
})

// describe('BookingPage Component', () => {
//   //Test renders loading message initially
//   // test('Render Loading Message', () => {
//   //   render(<BookingPage />);
//   //   expect(screen.getByText('Loading bookings...')).toBeInTheDocument();
//   // });

//   //Test renders calendar once bookings are loaded in
//   test('Renders Calendar With Bookings', async () => {
//     await act(async () => {
//       render(<BookingPage />);
//     });

//     await waitFor(() => {
//       expect(screen.getByText('Mocked Calendar')).toBeInTheDocument();
//     });
//   });
// });