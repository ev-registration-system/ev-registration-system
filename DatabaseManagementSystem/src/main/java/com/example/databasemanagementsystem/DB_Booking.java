package com.example.databasemanagementsystem;

import SharedDataTypes.Booking;
import SharedDataTypes.User;
import java.sql.*;
import java.util.ArrayList;

public class DB_Booking {
    private static final DB_Connection db = new DB_Connection();

    public static boolean add_booking(Booking to_add){
        Connection dbConnection = null;
        CallableStatement dbStatement = null;

        try{
            System.out.println("Adding Booking " + to_add.getBookingID());
            dbConnection = db.connect();
            dbStatement = dbConnection.prepareCall("{CALL add_booking(?,?,?,?,?,?)}");
            dbStatement.setInt("vehicle_ID", to_add.getVehicleID());
            dbStatement.setInt("user_ID", to_add.getUserID());
            dbStatement.setInt("charger_ID", to_add.getChargerID());
            dbStatement.setDate("booking_date", to_add.getBookingDate());
            dbStatement.setTime("booking_startingTime", to_add.getStartTime());
            dbStatement.setTime("booking_endTime", to_add.getEndTime());
            dbStatement.executeQuery();
            System.out.println("User added");
        } catch(SQLException e){
            db.getSQLException(e);
            return false;
        } finally{
            db.closeConnection(dbStatement, dbConnection);
        }
        return true;
    }


    public static ArrayList<Booking> get_booking(User user_id){
        ArrayList<Booking> result = null;
        Connection dbConnection = null;
        CallableStatement dbStatement = null;
        ResultSet dbResultSet = null;
        try{
            System.out.println("Retrieving Booking for User ID: " + user_id.getUser_ID());
            dbConnection = db.connect();
            dbStatement = dbConnection.prepareCall("{CALL get_booking_by_user_ID(?)}");
            dbStatement.setInt("user_ID", user_id.getUser_ID());
            dbResultSet = dbStatement.executeQuery();
            result = dbResultSetRetriever(dbResultSet);

        } catch(SQLException e){
            db.getSQLException(e);
        } finally {
            db.closeResultSet(dbResultSet);
            db.closeConnection(dbStatement, dbConnection);
        }
        return result;
    }

    public static ArrayList<Booking> get_booking(Date dateToGet){
        ArrayList<Booking> result = null;
        Connection dbConnection = null;
        CallableStatement dbStatement = null;
        ResultSet dbResultSet = null;
        try{
            System.out.println("Retrieving Booking on: " + dateToGet.toString());
            dbConnection = db.connect();
            dbStatement = dbConnection.prepareCall("{CALL get_booking_by_date(?)}");
            dbStatement.setDate("booking_date", dateToGet);
            dbResultSet = dbStatement.executeQuery();
            result = dbResultSetRetriever(dbResultSet);

        } catch(SQLException e){
            db.getSQLException(e);
        } finally {
            db.closeResultSet(dbResultSet);
            db.closeConnection(dbStatement, dbConnection);
        }
        return result;
    }

    public static ArrayList<Booking> get_booking(Date startDate, Date endDate){
        ArrayList<Booking> result = null;
        Connection dbConnection = null;
        CallableStatement dbStatement = null;
        ResultSet dbResultSet = null;
        try{
            System.out.println("Retrieving Booking from: " + startDate.toString() + " to: " + endDate.toString());
            dbConnection = db.connect();
            dbStatement = dbConnection.prepareCall("{CALL get_booking_by_interval(?,?)}");
            dbStatement.setDate("booking_startTime", startDate);
            dbStatement.setDate("booking_endTime", endDate);
            dbResultSet = dbStatement.executeQuery();
            result = dbResultSetRetriever(dbResultSet);

        } catch(SQLException e){
            db.getSQLException(e);
        } finally {
            db.closeResultSet(dbResultSet);
            db.closeConnection(dbStatement, dbConnection);
        }
        return result;
    }

    public static boolean delete_booking(Booking to_delete){
        Connection dbConnection = null;
        CallableStatement dbStatement = null;
        try {
            System.out.println("Deleting Booking with ID: " + to_delete.getBookingID());
            dbConnection = db.connect();
            dbStatement = dbConnection.prepareCall("{CALL delete_booking(?)}");
            dbStatement.setInt("booking_ID", to_delete.getBookingID());
            dbStatement.executeQuery();
        } catch(SQLException e){
            db.getSQLException(e);
        } finally {
            db.closeConnection(dbStatement, dbConnection);
        }
        return true;
    }


    private static ArrayList<Booking> dbResultSetRetriever(ResultSet dbResultSet){
        ArrayList<Booking> result = new ArrayList<>();
        try {
            while (dbResultSet.next()) {

                int bookingID = dbResultSet.getInt("booking_ID");
                int vehicleID = dbResultSet.getInt("vehicle_ID");
                int userID = dbResultSet.getInt("user_ID");
                int chargerID = dbResultSet.getInt("charger_ID");
                Date bookingDate = dbResultSet.getDate("booking_date");
                Time booking_startTime = dbResultSet.getTime("booking_startTime");
                Time booking_endTime = dbResultSet.getTime("booking_endTime");

                Booking temp = new Booking(bookingID,
                        vehicleID,
                        userID,
                        chargerID,
                        bookingDate,
                        booking_startTime,
                        booking_endTime);

                result.add(temp);
            }
        } catch(SQLException e){
            db.getSQLException(e);
        }
        return result;
    }

}
