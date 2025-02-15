package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import lombok.extern.slf4j.Slf4j;
import javax.servlet.http.HttpServletRequest;

import com.example.demo.model.RegisterRequest;
import com.example.demo.model.ForgotPasswordRequest;
import com.example.demo.model.LoginRequest;
import com.example.demo.model.ApiResponse;
import com.example.demo.service.UserService;
import com.example.demo.entity.User;
import com.example.demo.util.JwtUtil;
import com.example.demo.model.ErrorResponse;
import com.example.demo.model.LoginResponse;
import com.example.demo.model.ResetPasswordRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

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
        userService.sendPasswordResetEmail(request.getEmail());
        return ResponseEntity.ok().body(new ApiResponse(true, "重置密码邮件已发送"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = userService.login(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(new LoginResponse(token, "登录成功"));
        } catch (Exception e) {
            log.error("登录失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("登录失败: " + e.getMessage()));
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(@RequestHeader("Authorization") String token) {
        try {
            if (!token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("无效的token格式"));
            }
            
            String actualToken = token.substring(7);
            // 验证 token
            if (jwtUtil.validateToken(actualToken)) {
                return ResponseEntity.ok(Map.of("valid", true));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("token已过期或无效"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("token验证失败"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            // 获取当前用户的token
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            // 可以在这里添加token黑名单逻辑
            log.info("用户登出成功");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "登出成功"
            ));
        } catch (Exception e) {
            log.error("登出失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "message", "登出失败: " + e.getMessage()
                ));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            userService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok().body(new ApiResponse(true, "密码重置成功"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}