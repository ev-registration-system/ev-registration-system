package com.example.databasemanagementsystem;

import SharedDataTypes.User;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DB_User {
    public static User get_User(String emailIn, String passwordIn){
        Connection dbConnection = DB_Connection.connect();
        CallableStatement dbStatement = null;
        ResultSet dbResultSet = null;
        User result = null;

        try{
            System.out.println("Getting user");
            dbStatement = dbConnection.prepareCall("{CALL get_user(?)}");
            dbStatement.setString("email", emailIn);
            dbStatement.setString("password", passwordIn);
            dbResultSet = dbStatement.executeQuery();
            while(dbResultSet.next()){
                String username = dbResultSet.getString("username");
                String password = dbResultSet.getString("password");
                String email = dbResultSet.getString("email");
                result = new User(username, password, email);
            }
            System.out.println("User retrieved");
        } catch (SQLException e) {
            DB_Connection.getSQLException(e);
        } finally {
            DB_Connection.closeConnection(dbStatement, dbConnection);
            DB_Connection.closeResultSet(dbResultSet);
        }
        return result;
    }
}
