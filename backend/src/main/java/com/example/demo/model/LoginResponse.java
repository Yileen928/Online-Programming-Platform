package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String message;
    private Long userId;
    
    public LoginResponse(String message) {
        this.message = message;
    }
    
    public LoginResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }
}