import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReservationModal from '../../src/components/Bookings/ReservationModal';
import { addDoc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(() => 'mockCollection'),
    addDoc: jest.fn(() => Promise.resolve({ id: 'mockBookingId' })),
    Timestamp: {
      fromDate: jest.fn((date: Date) => ({
        seconds: Math.floor(date.getTime() / 1000),
        nanoseconds: 0,
      })),
    },
}));

describe('ReservationModal - Adding a Booking', () => {
    //Tests that a new booking is created and added
    test('New Booking Added', async () => {
        const mockOnClose = jest.fn();
      
        render(<ReservationModal isOpen={true} onClose={mockOnClose} />);
      
        const startTimeInput = screen.getByLabelText('Start Time:');
        const endTimeInput = screen.getByLabelText('End Time:');
        const submitButton = screen.getByText('Submit');
      
        fireEvent.change(startTimeInput, { target: { value: '2024-11-01T10:00' } }); // UTC time
        fireEvent.change(endTimeInput, { target: { value: '2024-11-01T12:00' } }); // UTC time
      
        fireEvent.click(submitButton);
      
        await waitFor(() => {
          // Adjusted UTC timestamps
          const startTimestamp = { seconds: 1730466000, nanoseconds: 0 }; // 2024-11-01T10:00 UTC
          const endTimestamp = { seconds: 1730473200, nanoseconds: 0 };   // 2024-11-01T12:00 UTC
      
          expect(addDoc).toHaveBeenCalledWith('mockCollection', {
            startTime: startTimestamp,
            endTime: endTimestamp,
          });
      
          expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });;
});

