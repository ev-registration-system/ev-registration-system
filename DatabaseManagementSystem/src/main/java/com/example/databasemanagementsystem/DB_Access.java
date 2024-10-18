package com.example.databasemanagementsystem;

import SharedDataTypes.*;

import java.util.HashMap;

public class DB_Access implements Database{
    /*
    ====================================================================================================================
    User Methods
    ====================================================================================================================
     */
    @Override
    public User getUser(String email, String password) {
        return DB_User.get_User(email, password);
    }

    @Override
    public boolean add_User(User user) {
        return false;
    }

    @Override
    public boolean update_User(User user) {
        return false;
    }

    @Override
    public Booking get_booking(int user_ID) {
        return null;
    }

    @Override
    public boolean delete_booking(int booking_id) {
        return false;
    }

    @Override
    public HashMap<String, Boolean> getTimeSlot(String date) {
        return null;
    }

    @Override
    public boolean create_booking(Booking to_add) {
        return false;
    }


    /*
    ====================================================================================================================
    Reservation Methods
    ====================================================================================================================
     */



    /*
    ====================================================================================================================
    Ticketing Methods
    ====================================================================================================================
     */
}
