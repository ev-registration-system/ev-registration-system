package com.example.databasemanagementsystem;

import SharedDataTypes.*;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DB_User {
    static DB_Connection db = new DB_Connection();
    public static User get_User(String emailIn, String passwordIn){
        Connection dbConnection = null;
        CallableStatement dbStatement = null;
        ResultSet dbResultSet = null;
        User result = null;

        try{
            dbConnection = db.connect();
            System.out.println("Getting user");
            dbStatement = dbConnection.prepareCall("{CALL get_user(?,?)}");
            dbStatement.setString("email", emailIn);
            dbStatement.setString("password", passwordIn);
            dbResultSet = dbStatement.executeQuery();
            while(dbResultSet.next()){
                int user_ID = dbResultSet.getInt("user_ID");
                String username = dbResultSet.getString("username");
                String password = dbResultSet.getString("password");
                String email = dbResultSet.getString("email");
                String firstName = dbResultSet.getString("firstName");
                String lastName = dbResultSet.getString("lastName");
                result = new User(user_ID, username, password, email, firstName, lastName);
            }
            System.out.println("User retrieved");
        } catch (SQLException e) {
            db.getSQLException(e);
        } finally {
            db.closeConnection(dbStatement, dbConnection);
            db.closeResultSet(dbResultSet);
        }
        return result;
    }

    public static boolean add_User(User user){
        return false;
    }

    public static boolean update_user(User user){
        return false;
    }
}
