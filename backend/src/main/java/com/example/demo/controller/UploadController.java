package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.service.UploadService;
import lombok.extern.slf4j.Slf4j;
import java.util.Map;
import org.springframework.security.core.Authentication;
import com.example.demo.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import com.example.demo.service.DatasetService;
import com.example.demo.entity.Dataset;

@RestController
@RequestMapping("/api/upload")
@Slf4j
public class UploadController {

    @Autowired
    private UploadService uploadService;
    @Autowired
    private DatasetService datasetService;
    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(
        @RequestParam("file") MultipartFile file,
        Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "未登录", "message", "请先登录"));
            }

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            log.info("用户 {} 开始上传头像", userDetails.getUsername());

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "文件为空", "message", "请选择要上传的文件"));
            }

            String fileUrl = uploadService.saveImage(file, userDetails.getUserId());
            
            return ResponseEntity.ok(Map.of(
                "url", fileUrl,
                "message", "文件上传成功"
            ));
        } catch (Exception e) {
            log.error("文件上传失败", e);
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage(),
                "message", "文件上传失败: " + e.getMessage()
            ));
        }
    }
    @PostMapping("/dataset")
    public ResponseEntity<?> uploadDataset(
        @RequestParam("file") MultipartFile file,
        @RequestParam("name") String name,
        @RequestParam("description") String description,
        Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "未登录", "message", "请先登录"));
            }

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            log.info("用户 {} 开始上传数据集 {}", userDetails.getUsername(), name);

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "文件为空", "message", "请选择要上传的文件"));
            }

Dataset dataset = datasetService.uploadDataset(file, name, description, userDetails.getUserId().toString());
            
            return ResponseEntity.ok(Map.of(
                "id", dataset.getId(),
                "message", "数据集上传成功"
            ));
        } catch (Exception e) {
            log.error("数据集上传失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", e.getMessage(),
                "message", "数据集上传失败: " + e.getMessage()
            ));
        }
    }
}