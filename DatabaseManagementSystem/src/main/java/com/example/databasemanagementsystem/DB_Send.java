package com.example.databasemanagementsystem;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DB_Send {
    private final RestTemplate restTemplate = new RestTemplate();
}
