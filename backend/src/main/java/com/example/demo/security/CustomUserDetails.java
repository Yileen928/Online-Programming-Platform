package com.example.demo.security;

import lombok.Data;

@Data
public class CustomUserDetails {
    private final Long userId;
    private final String username;

    public CustomUserDetails(Long userId, String username) {
        this.userId = userId;
        this.username = username;
    }
} 