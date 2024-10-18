package SharedDataTypes;

import java.sql.Date;
import java.sql.Time;

public class Booking {
    private final int bookingID;
    private int vehicleID;
    private int userID;
    private int chargerID;
    private Date bookingDate;
    private Time startTime;
    private Time endTime;

    public Booking(int bookingID, int vehicleID, int userID, int chargerID, Date bookingDate, Time startTime, Time endTime) {
        this.bookingID = bookingID;
        this.vehicleID = vehicleID;
        this.userID = userID;
        this.chargerID = chargerID;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public int getBookingID() {
        return bookingID;
    }

    public int getVehicleID(){return vehicleID;}

    public int getUserID() {
        return userID;
    }

    public int getChargerID() {
        return chargerID;
    }

    public Date getBookingDate() {
        return bookingDate;
    }

    public Time getStartTime() {
        return startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public void setVehicleID(int vehicleID){this.vehicleID=vehicleID;}
    public void setUserID(int userID) {
        this.userID = userID;
    }

    public void setChargerIC(int chargerID) {
        this.chargerID = chargerID;
    }

    public void setBookingDate(Date bookingDate) {
        this.bookingDate = bookingDate;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }
}
