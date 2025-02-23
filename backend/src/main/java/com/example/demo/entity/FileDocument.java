package com.example.demo.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "files")
public class FileDocument {
    @Id
    private String id;
    private String filename;
    private String contentType;
    private byte[] content;
    private Long userId;
    private LocalDateTime uploadTime;
    private String fileType; // 例如："avatar"
} 