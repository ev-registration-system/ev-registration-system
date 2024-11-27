import { render, screen, fireEvent } from '@testing-library/react';
import DeleteBooking from '../../src/components/Bookings/DeleteBooking';
import { act } from 'react';

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    doc: jest.fn(() => ({})),
    deleteDoc: jest.fn(() => Promise.resolve()),
}));

describe('DeleteBooking Component', () => {
  const mockOnClose = jest.fn();
  const mockOnDelete = jest.fn();

  test('renders the modal when open', () => {
    render(
      <DeleteBooking isOpen={true} onClose={mockOnClose} bookingId="123" onDelete={mockOnDelete} />
    );

    expect(screen.getByText('Are you sure you want to delete this reservation?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('calls deleteDoc and onDelete when "Yes" is clicked', async () => {
    const { deleteDoc } = require('firebase/firestore');
  
    render(
      <DeleteBooking isOpen={true} onClose={mockOnClose} bookingId="123" onDelete={mockOnDelete} />
    );
  
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
  
    // Wait for async operations to complete
    await screen.findByText('Yes');
  
    expect(deleteDoc).toHaveBeenCalledWith(expect.any(Object)); // Ensure `deleteDoc` was called
    expect(mockOnDelete).toHaveBeenCalled(); // Validate `onDelete` callback
    expect(mockOnClose).toHaveBeenCalled(); // Validate `onClose` callback
  });  

  /*test('calls onClose when "Cancel" is clicked', () => {
    render(
      <DeleteBooking isOpen={true} onClose={mockOnClose} bookingId="123" onDelete={mockOnDelete} />
    );
  
    const cancelButton = screen.getByText('Cancel');
  
    act(() => {
      fireEvent.click(cancelButton);
    });
  
    // Assert `mockOnClose` is called exactly once
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    // Assert `mockOnDelete` is not called
    expect(mockOnDelete).not.toHaveBeenCalled();
  }); */
});
