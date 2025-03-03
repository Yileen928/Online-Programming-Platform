package com.example.demo.service;

import com.example.demo.entity.Dataset;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface DatasetService {
    Dataset uploadDataset(MultipartFile file, String name, String description, String uploadedBy);
    Dataset getDataset(String id);
    List<Dataset> getAllDatasets();
    void deleteDataset(String id);
    Dataset updateDataset(String id, Dataset dataset);
    List<Dataset> searchDatasets(String keyword);
    byte[] downloadDataset(String id);
}