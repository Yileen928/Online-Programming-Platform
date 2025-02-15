package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.FileDocument;
import com.example.demo.repository.FileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    private static final Logger log = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileRepository fileRepository;

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable String id) {
        try {
            FileDocument fileDocument = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("文件不存在"));

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileDocument.getContentType()))
                .header("Cache-Control", "max-age=31536000")
                .body(fileDocument.getContent());
        } catch (Exception e) {
            log.error("获取文件失败", e);
            return ResponseEntity.notFound().build();
        }
    }
} 