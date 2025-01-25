package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.service.ProjectService;
import com.example.demo.entity.Project;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<?> createProject(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            String template = (String) request.get("template");
            boolean isPublic = (boolean) request.get("isPublic");
            Long userId = Long.parseLong(request.get("userId").toString());
            
            Project project = projectService.createProject(name, template, isPublic, userId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "projectId", project.getId(),
                "message", "项目创建成功"
            ));
        } catch (Exception e) {
            log.error("Create project error", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "创建项目失败: " + e.getMessage()
            ));
        }
    }
} 