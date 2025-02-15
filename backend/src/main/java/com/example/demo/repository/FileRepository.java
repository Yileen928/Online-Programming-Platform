package com.example.demo.repository;

import com.example.demo.entity.FileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FileRepository extends MongoRepository<FileDocument, String> {
    FileDocument findByUserIdAndFileType(Long userId, String fileType);
} 