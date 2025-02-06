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

@RestController
@RequestMapping("/api/projects")
@Slf4j
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<?> getProjects() {
        try {
            return ResponseEntity.ok(new ApiResponse(true, projectService.getAllProjects(), "获取项目列表成功"));
        } catch (Exception e) {
            log.error("获取项目列表失败", e);
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, "获取项目列表失败: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
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
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok(new ApiResponse(true, null, "项目删除成功"));
        } catch (Exception e) {
            log.error("删除项目失败", e);
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, "删除项目失败: " + e.getMessage()));
        }
    }
} 