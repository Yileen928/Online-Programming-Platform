package com.example.demo.service;

import com.example.demo.entity.Avatar;
import com.example.demo.entity.User;
import com.example.demo.repository.AvatarRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;
import java.io.IOException;

@Service
@Slf4j
public class AvatarService {
    
    @Autowired
    private AvatarRepository avatarRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public User updateAvatar(Long userId, MultipartFile file) throws IOException {
        // 验证文件
        validateFile(file);
        
        // 获取用户
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("用户不存在"));
            
        try {
            // 删除旧头像
            avatarRepository.findByUserId(userId)
                .ifPresent(oldAvatar -> avatarRepository.delete(oldAvatar));
            
            // 创建新头像
            Avatar avatar = Avatar.create(
                userId,
                file.getOriginalFilename(),
                file.getContentType(),
                file.getBytes()
            );
            
            // 保存头像
            Avatar savedAvatar = avatarRepository.save(avatar);
            log.info("头像已保存: avatarId={}, userId={}, size={}", 
                savedAvatar.getId(), userId, savedAvatar.getSize());
            
            // 更新用户信息
            user.setAvatarId(savedAvatar.getId());
            user.setAvatarUrl("/api/avatars/" + savedAvatar.getId());
            user.setAvatarUpdatedAt(savedAvatar.getUploadTime());
            
            return userRepository.save(user);
        } catch (Exception e) {
            log.error("头像更新失败: userId={}, error={}", userId, e.getMessage());
            throw new RuntimeException("头像更新失败: " + e.getMessage());
        }
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("文件不能为空");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("只支持图片文件");
        }
        
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new RuntimeException("图片大小不能超过2MB");
        }
    }
    
    public Avatar getAvatar(String id) {
        return avatarRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("头像不存在"));
    }
} 