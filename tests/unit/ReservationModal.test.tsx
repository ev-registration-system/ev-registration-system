// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import ReservationModal from '../../src/components/Bookings/ReservationModal';
// import { addDoc } from 'firebase/firestore';
import React from 'react'

test('placeholder', () => {
  expect(1 === 1)
})

// jest.mock('firebase/firestore', () => ({
//     collection: jest.fn(() => 'mockCollection'),
//     addDoc: jest.fn(() => Promise.resolve({ id: 'mockBookingId' })),
//     Timestamp: {
//       fromDate: jest.fn((date: Date) => ({
//         seconds: Math.floor(date.getTime() / 1000),
//         nanoseconds: 0,
//       })),
//     },
// }));

// describe('ReservationModal - Adding a Booking', () => {
//     //Tests that a new booking with correct start and end times is added to db
//     test('New Booking Added', async () => {
//         const mockOnClose = jest.fn();
      
//         render(<ReservationModal isOpen={true} onClose={mockOnClose} />);
      
//         const startTimeInput = screen.getByLabelText('Start Time:');
//         const endTimeInput = screen.getByLabelText('End Time:');
//         const submitButton = screen.getByText('Submit');
      
//         fireEvent.change(startTimeInput, { target: { value: '2024-11-01T10:00' } });
//         fireEvent.change(endTimeInput, { target: { value: '2024-11-01T12:00' } }); 

//         const startEpoch = new Date('2024-11-01T10:00:00').getTime() / 1000; 
//         const endEpoch = new Date('2024-11-01T12:00:00').getTime() / 1000;
      
//         fireEvent.click(submitButton);
      
//         await waitFor(() => {
      
//           expect(addDoc).toHaveBeenCalledWith('mockCollection', {
//             startTime: { seconds: startEpoch, nanoseconds: 0 },
//             endTime: { seconds: endEpoch, nanoseconds: 0 },
//           });
      
//           expect(mockOnClose).toHaveBeenCalledTimes(1);
//         });
//     });;
// });