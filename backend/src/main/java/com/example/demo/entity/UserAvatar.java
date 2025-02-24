package com.example.demo.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import lombok.Data;
import java.time.LocalDateTime;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "avatars")
@Data
public class UserAvatar {
    @Id
    private String id;
    
    @Indexed(unique = true)  // 为userId添加唯一索引
    private Long userId;
    
    private String filename;
    private String contentType;
    private byte[] data;        // 存储图片的二进制数据
    private long fileSize;      // 改为 fileSize
    private LocalDateTime uploadTime;
} 