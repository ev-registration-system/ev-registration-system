import { render, screen } from '@testing-library/react';
import Calendar from '../../src/components/Bookings/Calendar';
import { Booking } from '../../src/types/types';

jest.mock('../../src/components/Bookings/DeleteBooking', () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="delete-modal">Mocked Delete Booking Modal</div> : null,
}));

describe('Calendar Component', () => {
  const mockUserBookings: Booking[] = [
    { id: '1', startTime: new Date('2023-11-01T10:00:00Z'), endTime: new Date('2023-11-01T12:00:00Z'), userId: "mock-user-id", checkedIn: false },
  ];

  const mockOtherBookings: Booking[] = [
    { id: '2', startTime: new Date('2023-11-02T14:00:00Z'), endTime: new Date('2023-11-02T16:00:00Z'), userId: "other-user-id", checkedIn: false },
  ];

  test('Renders User and Other Bookings on Calendar', () => {
    render(<Calendar bookings={{ userBookings: mockUserBookings, otherBookings: mockOtherBookings }} getBookings={jest.fn()} />);

    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('2:00 PM')).toBeInTheDocument();
  });

  /*test('Only allows selection of user bookings', () => {
    render(<Calendar bookings={{ userBookings: mockUserBookings, otherBookings: mockOtherBookings }} getBookings={jest.fn()} />);
    
    const userBookingEvent = screen.getByText('10:00 AM');
    //Checks to make sure only current user's bookings are clickable
    expect(userBookingEvent).toHaveStyle('cursor: pointer'); 

    const otherBookingEvent = screen.getByText('2:00 PM');
    //Checks to make sure other user's bookings aren't clickable
    expect(otherBookingEvent).toHaveStyle('cursor: default'); 
  });*/
});
