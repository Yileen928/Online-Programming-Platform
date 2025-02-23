package com.example.demo.controller;

import com.example.demo.entity.Avatar;
import com.example.demo.entity.User;
import com.example.demo.service.AvatarService;
import com.example.demo.model.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import com.example.demo.security.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/avatars")
@Slf4j
public class AvatarController {

    @Autowired
    private AvatarService avatarService;
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getAvatar(@PathVariable String id) {
        try {
            Avatar avatar = avatarService.getAvatar(id);
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(avatar.getContentType()))
                .contentLength(avatar.getSize())
                .header("Cache-Control", "max-age=31536000")
                .header("Content-Disposition", "inline")
                .body(avatar.getData());
        } catch (Exception e) {
            log.error("获取头像失败: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User updatedUser = avatarService.updateAvatar(userDetails.getUserId(), file);
            
            Map<String, Object> response = new HashMap<>();
            response.put("avatarId", updatedUser.getAvatarId());
            response.put("avatarUrl", updatedUser.getAvatarUrl());
            
            return ResponseEntity.ok(new ApiResponse(true, response, "头像更新成功"));
        } catch (Exception e) {
            log.error("头像上传失败: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, null, e.getMessage()));
        }
    }
} 