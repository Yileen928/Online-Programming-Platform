package com.example.demo.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class SecurityUtils {
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.error("No authenticated user found");
            throw new RuntimeException("No authenticated user found");
        }

        log.debug("Current authentication: {}", authentication);
        log.debug("Principal: {}", authentication.getPrincipal());
        
        // 从 JWT token 中获取用户名
        String username = authentication.getName();
        log.debug("Current username: {}", username);
        
        return Long.valueOf(username); // 因为我们在 token 中存储的是 user.getId().toString()
    }
} 