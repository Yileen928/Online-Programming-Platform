package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.service.UserService;
import com.example.demo.entity.User;
import java.util.Arrays;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.verifyUser(loginRequest.getUsername(), loginRequest.getPassword());
            if (user != null) {
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

    @GetMapping("/recent-projects")
    public ResponseEntity<?> getRecentProjects() {
        try {
            // 暂时返回空列表
            return ResponseEntity.ok(Arrays.asList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("获取最近项目失败"));
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

@Data
class ErrorResponse {
    private String message;

    public ErrorResponse(String message) {
        this.message = message;
    }
} 