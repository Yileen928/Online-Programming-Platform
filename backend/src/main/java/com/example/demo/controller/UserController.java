package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.service.UserService;
import com.example.demo.entity.User;
import com.example.demo.model.*;
import java.util.Map;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;

import com.example.demo.service.ProjectService;
import com.example.demo.entity.Project;
import org.springframework.security.core.Authentication;
import lombok.extern.slf4j.Slf4j;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.model.UserProfileRequest;
import com.example.demo.model.ChangePasswordRequest;
import com.example.demo.model.AvatarUpdateRequest;
import java.util.HashMap;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.entity.UserAvatar;
import com.example.demo.repository.UserAvatarRepository;

@SuppressWarnings("unused")
@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserAvatarRepository userAvatarRepository;

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
            String cleanToken = token.replace("Bearer ", "");
            List<Project> projects = projectService.getRecentProjectsByToken(cleanToken);
            return ResponseEntity.ok(new ApiResponse(true, projects, "获取成功"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, e.getMessage()));
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

    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(Authentication authentication) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userService.getUserById(userDetails.getUserId().toString());
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            
            // 从MongoDB获取头像
            try {
                UserAvatar avatar = userAvatarRepository.findByUserId(user.getId())
                    .orElse(null);
                if (avatar != null) {
                    String avatarUrl = String.format("http://localhost:8080/api/users/avatars/%s?t=%d", 
                        avatar.getId(), System.currentTimeMillis());
                    userInfo.put("avatarUrl", avatarUrl);
                }
            } catch (Exception e) {
                log.warn("获取用户头像失败: userId={}", user.getId(), e);
            }
            
            return ResponseEntity.ok(new ApiResponse(true, userInfo, "获取用户信息成功"));
        } catch (Exception e) {
            log.error("获取用户信息失败", e);
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, e.getMessage()));
        }
    }
    
    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileRequest request) {
        try {
            if (request.getUserId() == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "用户ID不能为空"
                ));
            }
            
            log.info("更新用户信息: {}", request);
            userService.updateProfile(request.getUserId(), request);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "个人信息更新成功"
            ));
        } catch (Exception e) {
            log.error("更新用户信息失败", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "更新失败: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            boolean needRelogin = userService.changePassword(userDetails.getUserId(), request);
            return ResponseEntity.ok(new ApiResponse(true, needRelogin, "密码修改成功，请重新登录"));
        } catch (Exception e) {
            log.error("修改密码失败", e);
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @GetMapping("/avatars/{id}")
    public ResponseEntity<?> getAvatar(@PathVariable String id) {
        try {
            UserAvatar avatar = userAvatarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("头像不存在"));
            
            if (avatar.getData() == null || avatar.getData().length == 0) {
                log.error("头像数据为空: id={}", id);
                return ResponseEntity.notFound().build();
            }

            MediaType mediaType = MediaType.parseMediaType(
                avatar.getContentType() != null ? avatar.getContentType() : "image/jpeg"
            );
            
            return ResponseEntity.ok()
                .contentType(mediaType)
                .header("Cache-Control", "max-age=31536000")
                .header("Content-Disposition", "inline; filename=" + avatar.getFilename())
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, OPTIONS")
                .header("Access-Control-Allow-Headers", "*")
                .contentLength(avatar.getFileSize())
                .body(avatar.getData());
        } catch (Exception e) {
            log.error("获取头像失败: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, null, "文件不能为空"));
            }
            
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User updatedUser = userService.updateAvatar(userDetails.getUserId(), file);
            
            // 从MongoDB获取新保存的头像
            UserAvatar avatar = userAvatarRepository.findByUserId(updatedUser.getId())
                .orElseThrow(() -> new RuntimeException("头像保存失败"));
            
            // 构建正确的头像URL
            String avatarUrl = "/api/users/avatars/" + avatar.getId();
            
            Map<String, Object> response = new HashMap<>();
            response.put("avatarId", avatar.getId());
            response.put("avatarUrl", avatarUrl);
            
            return ResponseEntity.ok(new ApiResponse(true, response, "头像更新成功"));
        } catch (Exception e) {
            log.error("头像上传失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, null, "头像上传失败: " + e.getMessage()));
        }
    }
}