package com.example.demo.model;

import lombok.Data;

@Data
public class UserProfileRequest {
    private Long userId;
    private String email;
    private String username;
} 