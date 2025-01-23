package com.example.demo.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "resilience4j.ratelimiter")
public class RateLimiterConfig {
    private Instances instances = new Instances();

    @Data
    public static class Instances {
        private CodeExecution codeExecution = new CodeExecution();

        @Data
        public static class CodeExecution {
            private int limitForPeriod = 10;
            private String limitRefreshPeriod = "1m";
            private int timeoutDuration = 0;
        }
    }
} 