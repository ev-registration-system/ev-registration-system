import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { Booking } from "../types/types";

export function subscribeToBookings(callback: (bookings: Booking[]) => void) {
  const ref = collection(db, "bookings");
  return onSnapshot(ref, (querySnapshot) => {
    const bookings = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        startTime: data.startTime.toDate(),
        endTime: data.endTime.toDate(),
        userId: data.userId,
        checkedIn: data.checkedIn || false,
        vehicleId: data.vehicleId,
        validVehicle: data.validVehicle || false,
      } as Booking;
    });
    callback(bookings);
  });
}