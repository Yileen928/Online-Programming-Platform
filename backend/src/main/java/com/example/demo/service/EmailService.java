package com.example.demo.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    public void sendPasswordResetEmail(String email, String token) {
        // 实现发送重置密码邮件的逻辑
        // 可以使用 JavaMailSender 或其他邮件服务
        System.out.println("发送重置密码邮件到: " + email + ", 令牌: " + token);
    }
} 