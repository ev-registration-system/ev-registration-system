import { render, screen, waitFor } from '@testing-library/react';
import BookingPage from '../../src/views/BookingPage/BookingPage';

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

describe('BookingPage Component', () => {
  test('renders "Loading bookings..." initially', () => {
    render(<BookingPage />);
    expect(screen.getByText('Loading bookings...')).toBeInTheDocument();
  });

  test('renders Calendar when bookings are loaded', async () => {
    render(<BookingPage />);
    await waitFor(() => {
      expect(screen.getByText('Mocked Calendar')).toBeInTheDocument();
    });
  });
});