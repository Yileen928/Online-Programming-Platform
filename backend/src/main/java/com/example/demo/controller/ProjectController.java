package com.example.demo.controller;

import com.example.demo.dto.ProjectCreateRequest;
import com.example.demo.entity.Project;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody ProjectCreateRequest request) {
        try {
            log.info("Received project creation request: {}", request);
            
            // 这里暂时hardcode用admin用户，实际应该从认证信息中获取
            User user = userRepository.findByUsername("admin")
                .orElseThrow(() -> {
                    log.error("Admin user not found");
                    return new RuntimeException("User not found");
                });
            
            log.info("Found user: {}", user);
            
            Project project = projectService.createProject(request, user.getId());
            log.info("Project created: {}", project);
            
            Map<String, Object> response = Map.of(
                "projectId", project.getId(),
                "message", "Project created successfully"
            );
            
            log.info("Sending response: {}", response);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to create project. Request: {}", request, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "message", "Failed to create project: " + e.getMessage(),
                    "error", true
                ));
        }
    }
} 