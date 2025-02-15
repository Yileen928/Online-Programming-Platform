package com.example.demo.service;

import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailService {
    
    public void sendResetPasswordEmail(String email, String token) {
        log.info("模拟发送密码重置邮件到 {}, token: {}", email, token);
        // 暂时只打印日志，不实际发送邮件
    }
} 