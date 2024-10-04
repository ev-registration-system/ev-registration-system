package com.example.databasemanagementsystem;

import SharedDataTypes.User;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DB_Send {
    private final RestTemplate restTemplate = new RestTemplate();

    public void sendUser(User user){
        String url = "http://localhost:8082";
        HttpEntity<User> entity = new HttpEntity<>(user);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
    }
}
