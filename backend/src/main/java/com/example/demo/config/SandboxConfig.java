package com.example.demo.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "sandbox")
public class SandboxConfig {
    private boolean enabled = true;
    private String memoryLimit = "256m";
    private int cpuTimeLimit = 2000;
    private String stackSize = "1m";
} 