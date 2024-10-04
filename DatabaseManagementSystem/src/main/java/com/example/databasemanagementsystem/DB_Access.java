package com.example.databasemanagementsystem;

import SharedDataTypes.User;

public class DB_Access implements Database{
    @Override
    public User getUser(String email, String password) {
        return DB_User.get_User(email, password);
    }
}
