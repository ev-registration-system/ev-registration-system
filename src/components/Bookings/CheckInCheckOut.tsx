import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { checkInController } from '../../utils/checkInController';
import { userCheckout } from '../../utils/userCheckout';

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
            validVehicle: data.validVehicle,
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
            if (booking.validVehicle) {
                foundValid = { state: true, id: booking.id };
            } else {
                console.log("Vehicle has not arrived");
            }
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
        try {
            await userCheckout(); 
            console.log("Successfully called checkInController Cloud Function!");
        } catch (err) {
            console.error("Error calling checkInController:", err);
            return;
        }
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
            try {
                await checkInController(); //This calls cloud function that publishes to check-in topic (To alert data controller)
                console.log("Successfully called checkInController Cloud Function!");
            } catch (err) {
                console.error("Error calling checkInController:", err);
                return;
            }
            await updateBookingCheckedInStatus(id, isValid);
            setIsCheckedIn(true);
            setIsDisabled(true);
            setTimeout(() => {
              setIsDisabled(false);
            }, 3000);
        }
    }		
}