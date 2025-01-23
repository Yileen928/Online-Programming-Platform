package com.example.demo.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "code.execution")
public class CodeExecutionConfig {
    private int timeout = 10000;
    private Pool pool = new Pool();

    @Data
    public static class Pool {
        private int coreSize = 5;
        private int maxSize = 10;
        private int queueCapacity = 25;
    }
} 