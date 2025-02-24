package com.example.demo.entity;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "datasets")
public class Dataset {
    @Id
    private String id;
    private String name;
    private String description;
    
    @DBRef
    private User uploader; // 引用User实体
    private String uploaderName; // 冗余存储上传者名称，便于查询
    private LocalDateTime uploadTime;
    private List<String> tags;
    private Long downloads;
    private Long likes;
    private Long comments;
    private String dataType; // 例如："图像"、"机器学习"等
    private Long size; // 数据集大小(字节)
    private String format; // 数据格式
    private String status; // 处理状态：PROCESSING, COMPLETED, FAILED
    private String fileId; // 添加 fileId 字段

    // 构造函数、getter和setter方法
    // ... 现有代码 ...
} 