import { render, screen, fireEvent } from '@testing-library/react';
import Calendar from '../../src/components/Bookings/Calendar';
import React from 'react';

jest.mock('../../src/components/Bookings/DeleteBooking', () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="delete-modal">Mocked Delete Booking Modal</div> : null,
}));

describe('Calendar Component', () => {
  const mockBookings = [
    { id: '1', start: new Date('2023-11-01T10:00:00Z'), end: new Date('2023-11-01T12:00:00Z') },
    { id: '2', start: new Date('2023-11-02T14:00:00Z'), end: new Date('2023-11-02T16:00:00Z') },
  ];
  const mockGetBookings = jest.fn();

  //Tests that start and end times of booking are properly displayed on calendar
  test('Renders Bookings on Calendar', () => {
    render(<Calendar bookings={mockBookings} getBookings={mockGetBookings} />);

    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('2:00 PM')).toBeInTheDocument();
  });
});
