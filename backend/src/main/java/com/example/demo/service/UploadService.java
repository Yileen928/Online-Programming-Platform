package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.entity.FileDocument;
import com.example.demo.repository.FileRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.entity.User;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;

@Service
@Slf4j
public class UploadService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${server.port}")
    private String serverPort;

    public String saveImage(MultipartFile file, Long userId) throws Exception {
        log.info("开始处理文件上传: {}", file.getOriginalFilename());
        
        // 检查文件
        if (file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("只支持图片文件");
        }

        // 查找并删除用户之前的头像
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("用户不存在"));
            
        if (user.getAvatarId() != null) {
            fileRepository.deleteById(user.getAvatarId());
        }

        // 保存新头像
        FileDocument fileDocument = new FileDocument();
        fileDocument.setFilename(UUID.randomUUID().toString());
        fileDocument.setContentType(file.getContentType());
        fileDocument.setContent(file.getBytes());
        fileDocument.setUserId(userId);
        fileDocument.setUploadTime(LocalDateTime.now());
        fileDocument.setFileType("avatar");

        FileDocument savedFile = fileRepository.save(fileDocument);
        
        // 更新用户的头像ID
        user.setAvatarId(savedFile.getId());
        userRepository.save(user);
        
        // 返回完整的URL
        return "http://localhost:" + serverPort + "/api/files/" + savedFile.getId();
    }
} 