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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

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

    @GetMapping("/check-password/{username}")
    public ResponseEntity<?> checkPasswordStatus(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        if (user != null) {
            boolean isEncrypted = user.getPassword().startsWith("$2a$");
            return ResponseEntity.ok(Map.of(
                "username", username,
                "isEncrypted", isEncrypted,
                "passwordLength", user.getPassword().length()
            ));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/reset-user-password")
    public ResponseEntity<?> resetUserPassword(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String newPassword = request.get("password");
            User user = userService.getUserByUsername(username);
            if (user != null) {
                user.setPassword(newPassword);
                userService.updateUser(user);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error resetting password", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/create-test")
    public ResponseEntity<?> createTestUser() {
        try {
            // 先删除已存在的测试用户
            User existingUser = userService.getUserByUsername("test");
            if (existingUser != null) {
                userRepository.delete(existingUser);
            }

            // 创建新的测试用户
            User user = new User();
            user.setUsername("test");
            user.setPassword("123456");
            user.setEmail("test@example.com");
            userRepository.save(user);
            
            return ResponseEntity.ok(Map.of(
                "message", "Test user created",
                "username", "test",
                "password", "123456"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}

@Data
class ErrorResponse {
    private String message;

    public ErrorResponse(String message) {
        this.message = message;
    }
} 