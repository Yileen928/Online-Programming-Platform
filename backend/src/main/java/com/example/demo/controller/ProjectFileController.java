package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.ProjectFileService;
import com.example.demo.model.ApiResponse;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/projects/{projectId}/files")
@Slf4j
public class ProjectFileController {

    @Autowired
    private ProjectFileService projectFileService;

    @GetMapping
    public ResponseEntity<?> getProjectFiles(@PathVariable Long projectId) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, projectFileService.getProjectFiles(projectId), "获取成功"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @GetMapping("/{fileId}/content")
    public ResponseEntity<?> getFileContent(@PathVariable Long projectId, @PathVariable Long fileId) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, projectFileService.getFileContent(projectId, fileId), "获取成功"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @PutMapping("/{fileId}/content")
    public ResponseEntity<?> saveFileContent(
            @PathVariable Long projectId,
            @PathVariable Long fileId,
            @RequestBody String content) {
        try {
            projectFileService.saveFileContent(projectId, fileId, content);
            return ResponseEntity.ok(new ApiResponse(true, null, "保存成功"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, e.getMessage()));
        }
    }
} 