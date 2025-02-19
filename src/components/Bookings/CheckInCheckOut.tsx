import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase'; // adjust the relative path as needed

const ref = collection(db, 'bookings')
const GRACE_PERIOD = 5 * 60 * 1000; // 5 minutes measured in ms


export async function checkForValidReservation(forCheckOut = false) {
    const querySnapshot = await getDocs(ref);
    const bookings = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
            id: doc.id,
            start: data.startTime.toDate(),
            end: data.endTime.toDate(),
            checkedIn: data.checkedIn,
        }
    });

    let foundValid = {state: false, id: ""}
    const now = new Date().getTime();
    bookings.forEach(booking => {
        //these are for testing:
        //const now = new Date("2025-02-16T06:00:00").getTime(); 
        //const now = new Date("2025-02-14T20:30:00").getTime(); 

        const start = booking.start.getTime();
        const end = booking.end.getTime();
        const checkedIn = booking.checkedIn;
        const graceStart = start - GRACE_PERIOD;

        //Looks for a booking that isn't checked in
        if (!forCheckOut && now >= graceStart && now <= end && checkedIn === false) {
            foundValid = { state: true, id: booking.id };
        }
        
        //Looks for a booking that's already checked in
        if (forCheckOut && checkedIn === true) {
            foundValid = { state: true, id: booking.id };
        }
    });
    return foundValid;

}

export async function updateBookingCheckedInStatus (bookingId: string, state: boolean) {
    const ref = doc(db, 'bookings', bookingId);
    try {
        await updateDoc(ref, {checkedIn: state})
        console.log(`Booking ${bookingId} updated to checkedIn: ${state}`)
      } catch (error) {
        console.error('Error updating booking:', error)
      }

}

export async function handleCheckInCheckOut(isCheckedIn: boolean,
                                            setIsCheckedIn: (value: boolean) => void,
                                            setIsDisabled: (value: boolean) => void) {
    if (isCheckedIn) {
        console.log('Checking out')
        const booking = await checkForValidReservation(true); 
        await updateBookingCheckedInStatus(booking.id, false);
        setIsCheckedIn(false);
        setIsDisabled(true);
    }
    else {
        const booking = await checkForValidReservation();
        const isValid = booking.state;
        const id = booking.id;

        if (!isValid) {
            console.log('no reservation found');
        }
        else {
            await updateBookingCheckedInStatus(id, isValid);
            setIsCheckedIn(true);
            setIsDisabled(true);
            setTimeout(() => {
              setIsDisabled(false);
            }, 3000);
        }
    }		
}