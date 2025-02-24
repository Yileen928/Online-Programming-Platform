package com.example.demo.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.Data;
import java.time.LocalDateTime;

@Document(collection = "avatars")
@Data
public class Avatar {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private Long userId;
    
    private String filename;
    private String contentType;
    private byte[] data;
    private long size;
    private LocalDateTime uploadTime;
    
    // 添加构造方法
    public static Avatar create(Long userId, String filename, String contentType, byte[] data) {
        Avatar avatar = new Avatar();
        avatar.setUserId(userId);
        avatar.setFilename(filename);
        avatar.setContentType(contentType);
        avatar.setData(data);
        avatar.setSize(data.length);
        avatar.setUploadTime(LocalDateTime.now());
        return avatar;
    }
} 