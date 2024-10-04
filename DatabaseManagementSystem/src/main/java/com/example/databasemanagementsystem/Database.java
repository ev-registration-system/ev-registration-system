package com.example.databasemanagementsystem;

import SharedDataTypes.User;

public interface Database {
    public User getUser(String email, String password);
}
