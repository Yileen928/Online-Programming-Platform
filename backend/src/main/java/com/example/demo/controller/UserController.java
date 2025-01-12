package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.Data;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            // 简单的登录逻辑，仅用于测试
            if ("admin".equals(loginRequest.getUsername()) && 
                "password".equals(loginRequest.getPassword())) {
                
                LoginResponse response = new LoginResponse();
                response.setToken("fake-jwt-token");
                response.setMessage("登录成功");
                return ResponseEntity.ok(response);
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse("用户名或密码错误"));
                
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse("登录失败"));
        }
    }
}

@Data
class LoginRequest {
    private String username;
    private String password;
}

@Data
class LoginResponse {
    private String token;
    private String message;

    public LoginResponse() {}

    public LoginResponse(String message) {
        this.message = message;
    }
} 