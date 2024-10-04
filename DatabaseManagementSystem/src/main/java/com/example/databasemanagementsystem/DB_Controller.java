package com.example.databasemanagementsystem;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class DB_Controller {
    private RestTemplate restTemplate;

    DB_Send sender = new DB_Send();
    DB_Access access = new DB_Access();

//    @PostMapping("getUser")
//    public void getUser(){
//
//    }

    @PostMapping("/AuthorizeUser")
    public void authorizeUser(@RequestParam("email") String email,
                              @RequestParam("password") String password){
        sender.sendUser(access.getUser(email, password));
    }
}
