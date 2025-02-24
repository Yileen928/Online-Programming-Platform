package com.example.demo.service;

import com.example.demo.entity.Dataset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface DatasetService {
    Dataset uploadDataset(MultipartFile file, String name, String description, String uploadedBy);
    Dataset getDataset(String id);
    Page<Dataset> getAllDatasets(Pageable pageable);
    void deleteDataset(String id);
    Dataset updateDataset(String id, Dataset dataset);
    Page<Dataset> searchDatasets(String keyword, Pageable pageable);
    byte[] getFileContent(String fileId);
} 