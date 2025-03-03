package com.example.demo.service.impl;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UploadService;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class UploadServiceImpl extends UploadService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GridFsTemplate gridFsTemplate;


    @Override
    public String saveImage(MultipartFile file, Long userId) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("只支持图片文件");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("用户不存在"));

        // 如果用户已有头像，删除旧头像
        if (user.getAvatarId() != null) {
            gridFsTemplate.delete(Query.query(Criteria.where("_id").is(new ObjectId(user.getAvatarId()))));
        }

        try {
            // 准备元数据
            DBObject metaData = new BasicDBObject();
            metaData.put("userId", userId);
            metaData.put("uploadTime", LocalDateTime.now());
            metaData.put("collection", "avatars");

            // 保存文件到GridFS
            ObjectId fileId = gridFsTemplate.store(
                file.getInputStream(),
                file.getOriginalFilename(),
                contentType,
                metaData
            );

            // 更新用户头像ID
            user.setAvatarId(fileId.toString());
            user.setAvatarUrl("/api/users/" + userId + "/avatar");
            userRepository.save(user);

            return user.getAvatarUrl();
        } catch (Exception e) {
            throw new RuntimeException("文件保存失败: " + e.getMessage());
        }
    }
}