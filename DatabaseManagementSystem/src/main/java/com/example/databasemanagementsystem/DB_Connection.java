package com.example.databasemanagementsystem;


import java.sql.*;

public class DB_Connection {

    public Connection connect(){
        Connection dbConnection = null;

        try{
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

    public void closeConnection(CallableStatement dbStatement, Connection dbConnection){
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

    public void closeResultSet(ResultSet dbResultSet){
        if(dbResultSet != null){
            try{
                dbResultSet.close();
            } catch(SQLException e){
                getSQLException(e);
            }
        }
    }

    public void getSQLException(SQLException e) {
        System.out.println("SQLException: " + e.getMessage());
        System.out.println("SQLState: " + e.getSQLState());
        System.out.println("VendorError: " + e.getErrorCode());
    }
}
