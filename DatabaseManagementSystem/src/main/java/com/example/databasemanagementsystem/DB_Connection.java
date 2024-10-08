package com.example.databasemanagementsystem;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.sql.*;
import java.util.Properties;

public class DB_Connection {

    public Connection connect(){
        Connection dbConnection = null;
        //Properties dbConnectionProps = new Properties();

        try{
//            FileInputStream inputStream = new FileInputStream("main/resources/db.properties");
//            dbConnectionProps.load(inputStream);
//
//            inputStream.close();
//
//            String url = dbConnectionProps.getProperty("url");
//            String username = dbConnectionProps.getProperty("username");
//            String password = dbConnectionProps.getProperty("password");

            String url = "jdbc:mysql://ev-registration-system.mysql.database.azure.com:3306/evregistrationsystem";
            String username="admin101";
            String password="EvRegistrationSystem!";

            dbConnection = DriverManager.getConnection(url, username, password);

        } catch (SQLException e) {
            getSQLException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return dbConnection;
    }

    public static void closeConnection(CallableStatement dbStatement, Connection dbConnection){
        if(dbStatement != null){
            try{
                dbStatement.close();
            } catch(SQLException e){
                getSQLException(e);
            }
        }

        if(dbConnection != null){
            try{
                dbConnection.close();
            } catch(SQLException e){
                getSQLException(e);
            }
        }
    }

    public static void closeResultSet(ResultSet dbResultSet){
        if(dbResultSet != null){
            try{
                dbResultSet.close();
            } catch(SQLException e){
                getSQLException(e);
            }
        }
    }

    public static void getSQLException(SQLException e) {
        System.out.println("SQLException: " + e.getMessage());
        System.out.println("SQLState: " + e.getSQLState());
        System.out.println("VendorError: " + e.getErrorCode());
    }
}
