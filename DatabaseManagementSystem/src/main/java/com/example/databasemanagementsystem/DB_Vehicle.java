package com.example.databasemanagementsystem;

import SharedDataTypes.User;
import SharedDataTypes.Vehicle;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DB_Vehicle {

    static DB_Connection db = new DB_Connection();
    public static boolean add_vehicle(Vehicle to_add){
        Connection dbConnection = null;
        CallableStatement dbStatement = null;

        try{
            dbConnection = db.connect();
            System.out.println("Adding vehicle with ID: " + to_add.getVehicle_ID());
            dbStatement = dbConnection.prepareCall("{CALL add_vehicle(?,?,?,?,?)}");
            dbStatement.setInt("user_ID", to_add.getUser_ID());
            dbStatement.setString("license_plate", to_add.getLicense_plate());
            dbStatement.setString("make", to_add.getMake());
            dbStatement.setString("model", to_add.getModel());
            dbStatement.setInt("year", to_add.getYear());
            dbStatement.executeQuery();
            System.out.println("Vehicle with ID: " + to_add.getVehicle_ID() + " has been successfully added");
        } catch(SQLException e){
            db.getSQLException(e);
            return false;
        } finally {
            db.closeConnection(dbStatement, dbConnection);
        }
        return true;
    }

    public static Vehicle get_vehicle(String license_plate){
        Connection dbConnection = null;
        CallableStatement dbStatement = null;
        ResultSet dbResultSet = null;
        Vehicle result = null;

        try{
            dbConnection = db.connect();
            System.out.println("Retrieving Vehicle with license plate: " + license_plate);
            dbStatement = dbConnection.prepareCall("{CALL get_vehicle(?)}");
            dbStatement.setString("license_plate", license_plate);
            dbResultSet = dbStatement.executeQuery();
            while(dbResultSet.next()){
                int vehicle_ID = dbResultSet.getInt("vehicle_ID");
                int user_ID = dbResultSet.getInt("user_ID");
                String make = dbResultSet.getString("make");
                String model = dbResultSet.getString("model");
                int year = dbResultSet.getInt("year");
                result = new Vehicle(vehicle_ID, user_ID, license_plate, make, model, year);
            }
            if(result != null) {
                System.out.println("Vehicle with license plate " + license_plate + " retrieved");
            } else {
                System.out.println("Vehicle with license plapte: " + license_plate + " Not Found");
            }
        } catch (SQLException e) {
            db.getSQLException(e);
        } finally {
            db.closeConnection(dbStatement, dbConnection);
            db.closeResultSet(dbResultSet);
        }
        return result;
    }

    public static boolean update_vehicle(Vehicle to_update){
        Connection dbConnection = null;
        CallableStatement dbStatement = null;

        try{
            dbConnection = db.connect();
            System.out.println("Updating vehicle with license plate " + to_update.getLicense_plate());
            dbStatement = dbConnection.prepareCall("{CALL add_vehicle(?,?,?,?,?,?)}");
            dbStatement.setInt("vehicle_ID", to_update.getVehicle_ID());
            dbStatement.setInt("user_ID", to_update.getUser_ID());
            dbStatement.setString("license_plate", to_update.getLicense_plate());
            dbStatement.setString("make", to_update.getMake());
            dbStatement.setString("model", to_update.getModel());
            dbStatement.setInt("year", to_update.getYear());
            dbStatement.executeQuery();
            System.out.println("Vehicle with ID: " + to_update.getVehicle_ID() + " has been successfully updated");
        } catch(SQLException e){
            db.getSQLException(e);
            return false;
        } finally {
            db.closeConnection(dbStatement, dbConnection);
        }
        return true;
    }

    public static boolean delete_vehicle(String license_plate){
        Connection dbConnection = null;
        CallableStatement dbStatement = null;

        try{
            dbConnection = db.connect();
            System.out.println("Deleting vehicle with license plate " + license_plate);
            dbStatement = dbConnection.prepareCall("{CALL delete_vehicle(?)}");
            dbStatement.setString("license_plate", license_plate);
            dbStatement.executeQuery();
            System.out.println("Vehicle with license plate " + license_plate + " has been successfully deleted");
        } catch(SQLException e){
            db.getSQLException(e);
            return false;
        } finally {
            db.closeConnection(dbStatement, dbConnection);
        }
        return true;
    }
}
