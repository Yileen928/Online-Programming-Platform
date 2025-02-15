package com.example.demo.controller;

import com.example.demo.entity.Dataset;
import com.example.demo.service.DatasetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/datasets")
public class DatasetController {

    @Autowired
    private DatasetService datasetService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDataset(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("uploadedBy") String uploadedBy) {
        try {
            Dataset dataset = datasetService.uploadDataset(file, name, description, uploadedBy);
            return ResponseEntity.ok(dataset);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("上传失败：" + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDataset(@PathVariable String id) {
        Dataset dataset = datasetService.getDataset(id);
        if (dataset != null) {
            return ResponseEntity.ok(dataset);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<?> getAllDatasets() {
        return ResponseEntity.ok(datasetService.getAllDatasets());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDataset(@PathVariable String id) {
        datasetService.deleteDataset(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchDatasets(@RequestParam String keyword) {
        return ResponseEntity.ok(datasetService.searchDatasets(keyword));
    }
} 