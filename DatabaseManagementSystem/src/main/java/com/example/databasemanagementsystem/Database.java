package com.example.databasemanagementsystem;

import SharedDataTypes.*;

import java.util.HashMap;

public interface Database {

    /*
    ====================================================================================================================
    User Methods
    ====================================================================================================================
     */
    User getUser(String email, String password);

    boolean add_User(User user);

    boolean update_User(User user);


    /*
    ====================================================================================================================
    Booking Methods
    ====================================================================================================================
     */
    boolean create_booking(Booking to_add);

    Booking get_booking(int user_ID);

    boolean delete_booking(int booking_id);

    HashMap<String, Boolean> getTimeSlot(String date);
    /*
    ====================================================================================================================
    Ticketing Methods
    ====================================================================================================================
     */
}
