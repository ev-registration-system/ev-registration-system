import { render, screen, fireEvent } from '@testing-library/react';
import DeleteBooking from '../../src/components/Bookings/DeleteBooking';
//import { act } from 'react';

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    doc: jest.fn(() => ({})),
    deleteDoc: jest.fn(() => Promise.resolve()),
}));

describe('DeleteBooking Component', () => {
  const mockOnClose = jest.fn();
  const mockOnDelete = jest.fn();

  //Test ensures modal is rendered
  test('Renders Delete Modal When Open', () => {
    render(
      <DeleteBooking isOpen={true} onClose={mockOnClose} bookingId="123" onDelete={mockOnDelete} />
    );

    expect(screen.getByText('Are you sure you want to delete this reservation?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  //Test calls deleteDoc and onDelete when "Yes" is clicked
  test('Delete Booking', async () => {
    const { deleteDoc } = require('firebase/firestore');
  
    render(
      <DeleteBooking isOpen={true} onClose={mockOnClose} bookingId="123" onDelete={mockOnDelete} />
    );
  
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
  
    await screen.findByText('Yes');
  
    expect(deleteDoc).toHaveBeenCalledWith(expect.any(Object)); //This Ensures `deleteDoc` was called
    expect(mockOnDelete).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled(); 
  });  
});
