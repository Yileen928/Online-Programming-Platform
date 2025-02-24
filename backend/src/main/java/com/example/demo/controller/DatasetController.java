package com.example.demo.controller;

import com.example.demo.entity.Dataset;
import com.example.demo.service.DatasetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.dto.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

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
            Authentication authentication) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            Dataset dataset = datasetService.uploadDataset(file, name, description, userDetails.getUserId().toString());
            return ResponseEntity.ok(new ApiResponse(true, dataset, "数据集上传成功"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, "上传失败: " + e.getMessage()));
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
    public ResponseEntity<?> getAllDatasets(@PageableDefault(size = 10) Pageable pageable, Authentication authentication) {
        try {
            Page<Dataset> datasets = datasetService.getAllDatasets(pageable);
            return ResponseEntity.ok(new ApiResponse(true, datasets, "获取成功"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDataset(@PathVariable String id) {
        datasetService.deleteDataset(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchDatasets(@RequestParam String keyword, @PageableDefault(size = 10) Pageable pageable) {
        try {
            Page<Dataset> datasets = datasetService.searchDatasets(keyword, pageable);
            return ResponseEntity.ok(new ApiResponse(true, datasets, "搜索成功"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, null, e.getMessage()));
        }
    }
} 