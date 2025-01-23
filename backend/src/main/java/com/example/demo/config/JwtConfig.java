package com.example.demo.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.jwt")
public class JwtConfig {
    private String secret = "your-secret-key-must-be-at-least-32-characters-long";
    private long expiration = 86400000; // 24 hours
} 