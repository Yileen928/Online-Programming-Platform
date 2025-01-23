package com.example.demo.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;

import com.example.demo.model.RegisterRequest;
import com.example.demo.model.ForgotPasswordRequest;
import com.example.demo.service.UserService;
import com.example.demo.dto.LoginRequest;
import com.example.demo.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // 检查用户名是否已存在
        if (userService.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("用户名已存在");
        }

        // 检查邮箱是否已存在
        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("邮箱已被注册");
        }

        // 创建新用户
        userService.createUser(request);
        return ResponseEntity.ok("注册成功");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        // 检查邮箱是否存在
        if (!userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("该邮箱未注册");
        }

        // 生成重置令牌并发送邮件
        userService.sendPasswordResetEmail(request.getEmail());
        return ResponseEntity.ok("重置链接已发送到邮箱");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            log.info("Received login request for user: {}", request.getUsername());
            String token = authService.login(request.getUsername(), request.getPassword());
            log.info("Login successful for user: {}", request.getUsername());
            return ResponseEntity.ok(Map.of(
                "token", token,
                "message", "登录成功"
            ));
        } catch (Exception e) {
            log.error("Login failed for user: {}", request.getUsername(), e);
            return ResponseEntity.badRequest().body(Map.of(
                "message", e.getMessage(),
                "error", true
            ));
        }
    }
}