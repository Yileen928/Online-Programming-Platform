package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.service.ProjectService;
import com.example.demo.entity.Project;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import com.example.demo.model.ErrorResponse;
import com.example.demo.model.ProjectRequest;
import com.example.demo.model.ApiResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.demo.security.CustomUserDetails;

@RestController
@RequestMapping("/api/projects")
@Slf4j
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping//获取项目列表
    public ResponseEntity<?> getProjects() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
                Long userId = ((CustomUserDetails) auth.getPrincipal()).getUserId();
                return ResponseEntity.ok(new ApiResponse(true, projectService.getProjectsByUserId(userId), "获取项目列表成功"));
            }
            return ResponseEntity.ok(new ApiResponse(true, projectService.getAllProjects(), "获取公开项目列表成功"));
        } catch (Exception e) {
            log.error("获取项目列表失败", e);
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, "获取项目列表失败: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")//更新项目
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project project) {
        try {
            project.setId(id);
            Project updatedProject = projectService.updateProject(project);
            return ResponseEntity.ok(new ApiResponse(true, updatedProject, "项目更新成功"));
        } catch (Exception e) {
            log.error("更新项目失败", e);
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, "更新项目失败: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")//删除项目
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok(new ApiResponse(true, null, "项目删除成功"));
        } catch (Exception e) {
            log.error("删除项目失败", e);
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, "删除项目失败: " + e.getMessage()));
        }
    }

    @PostMapping//创建项目
    public ResponseEntity<?> createProject(@RequestBody ProjectRequest projectRequest, @RequestHeader("Authorization") String token) {
        try {
            // 清理 token 字符串
            String cleanToken = token.replace("Bearer ", "");
            
            // 创建项目并绑定用户
            Project createdProject = projectService.createProject(
                projectRequest.getName(),
                projectRequest.getTemplate(),
                projectRequest.isPublic(),
                cleanToken
            );
            
            return ResponseEntity.ok(new ApiResponse(true, createdProject, "项目创建成功"));
        } catch (Exception e) {
            log.error("创建项目失败", e);
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, "创建项目失败: " + e.getMessage()));
        }
    }
} 