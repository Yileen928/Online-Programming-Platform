package com.example.demo.model;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String message;
    private Long userId;

    public LoginResponse() {}

    public LoginResponse(String message) {
        this.message = message;
    }
} 