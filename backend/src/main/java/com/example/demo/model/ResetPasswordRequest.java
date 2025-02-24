package com.example.demo.model;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String token;
    private String newPassword;
} 