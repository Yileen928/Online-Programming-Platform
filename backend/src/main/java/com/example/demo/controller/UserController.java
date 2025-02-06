package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.service.UserService;
import com.example.demo.entity.User;
import com.example.demo.model.*;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import com.example.demo.service.ProjectService;
import com.example.demo.entity.Project;

@SuppressWarnings("unused")
@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ProjectService projectService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            log.info("Login request received - username: {}", loginRequest.getUsername());
            
            User user = userService.verifyUser(loginRequest.getUsername(), loginRequest.getPassword());
            
            if (user != null) {
                log.info("Login successful for user: {}", loginRequest.getUsername());
                String token = jwtUtil.generateToken(user.getId(), user.getUsername());
                
                LoginResponse response = new LoginResponse();
                response.setToken(token);
                response.setMessage("登录成功");
                response.setUserId(user.getId());
                return ResponseEntity.ok(response);
            }
            
            log.warn("Login failed for user: {}", loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse("用户名或密码错误"));
        } catch (Exception e) {
            log.error("Login error for user: " + loginRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse("登录失败: " + e.getMessage()));
        }
    }

    @GetMapping("/projects")
    public ResponseEntity<?> getUserProjects(@RequestHeader("Authorization") String token) {
        try {
            List<Project> projects = projectService.getRecentProjectsByToken(token);
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            log.error("Error getting user projects", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("获取项目失败: " + e.getMessage()));
        }
    }

    @PostMapping("/projects")
    public ResponseEntity<?> createProject(
        @RequestHeader("Authorization") String token,
        @RequestBody ProjectRequest request
    ) {
        try {
            Project project = projectService.createProject(
                request.getName(),
                request.getTemplate(),
                request.isPublic(),
                token
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "projectId", project.getId(),
                "message", "项目创建成功"
            ));
        } catch (Exception e) {
            log.error("Error creating project", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("创建项目失败: " + e.getMessage()));
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

    @GetMapping("/check-auth")
    public ResponseEntity<?> checkAuth(@RequestHeader("Authorization") String token) {
        try {
            token = token.replace("Bearer ", "");
            Long userId = jwtUtil.getUserIdFromToken(token);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "userId", userId,
                "message", "用户已认证"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "success", false,
                    "message", "认证失败"
                ));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // 检查用户名是否已存在
            if (userService.getUserByUsername(request.getUsername()) != null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("用户名已存在"));
            }
            
            // 创建新用户
            User user = new User();
            user.setUsername(request.getUsername());
            user.setPassword(request.getPassword());
            user.setEmail(request.getEmail());
            
            // 保存用户
            User savedUser = userRepository.save(user);
            
            // 生成token并返回
            String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getUsername());
            
            return ResponseEntity.ok(Map.of(
                "message", "注册成功",
                "userId", savedUser.getId(),
                "token", token
            ));
        } catch (Exception e) {
            log.error("Registration error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("注册失败: " + e.getMessage()));
        }
    }
}