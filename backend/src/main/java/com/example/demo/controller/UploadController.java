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

@RestController
@RequestMapping("/api/upload")
@Slf4j
public class UploadController {

    @Autowired
    private UploadService uploadService;

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
} 