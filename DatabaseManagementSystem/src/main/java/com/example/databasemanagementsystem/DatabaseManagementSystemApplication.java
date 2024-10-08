package com.example.databasemanagementsystem;

import SharedDataTypes.User;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DatabaseManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(DatabaseManagementSystemApplication.class, args);
        System.out.println("Database Management System Online");
        DB_Access db = new DB_Access();
        User temp = db.getUser("User1@unb.ca", "User1");
        System.out.println("username: " + temp.getUsername() + " First name: " + temp.getFirstName());
    }

}
