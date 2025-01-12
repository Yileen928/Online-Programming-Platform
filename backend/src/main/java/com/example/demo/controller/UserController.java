package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.service.UserService;
import com.example.demo.entity.User;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

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
            // 模拟一些最近项目数据
            List<Map<String, Object>> recentProjects = Arrays.asList(
                Map.of(
                    "id", 1,
                    "title", "圆周计算",
                    "description", "计算圆的周长和面积",
                    "lastModified", "2024-01-12"
                ),
                Map.of(
                    "id", 2,
                    "title", "数组排序",
                    "description", "实现各种排序算法",
                    "lastModified", "2024-01-11"
                )
            );
            return ResponseEntity.ok(recentProjects);
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