package com.example.demo.service.impl;

import com.example.demo.entity.Dataset;
import com.example.demo.entity.User;
import com.example.demo.service.DatasetService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DatasetServiceImpl implements DatasetService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserService userService;

    @Override
    public Dataset uploadDataset(MultipartFile file, String name, String description, String uploaderId) {
        User uploader = userService.getUserById(uploaderId);
        if (uploader == null) {
            throw new RuntimeException("上传者不存在");
        }
        
        Dataset dataset = new Dataset();
        dataset.setName(name);
        dataset.setDescription(description);
        dataset.setUploader(uploader);
        dataset.setUploaderName(uploader.getUsername());
        dataset.setUploadTime(LocalDateTime.now());
        dataset.setDownloads(0L);
        dataset.setLikes(0L);
        dataset.setComments(0L);
        dataset.setSize(file.getSize());
        dataset.setStatus("PROCESSING");
        
        // 保存文件到GridFS
        // TODO: 实现文件保存逻辑
        
        return mongoTemplate.save(dataset);
    }

    @Override
    public Dataset getDataset(String id) {
        return mongoTemplate.findById(id, Dataset.class);
    }

    @Override
    public List<Dataset> getAllDatasets() {
        return mongoTemplate.findAll(Dataset.class);
    }

    @Override
    public void deleteDataset(String id) {
        mongoTemplate.remove(Query.query(Criteria.where("id").is(id)), Dataset.class);
    }

    @Override
    public Dataset updateDataset(String id, Dataset dataset) {
        dataset.setId(id);
        return mongoTemplate.save(dataset);
    }

    @Override
    public List<Dataset> searchDatasets(String keyword) {
        Query query = new Query();
        query.addCriteria(new Criteria().orOperator(
            Criteria.where("name").regex(keyword, "i"),
            Criteria.where("description").regex(keyword, "i")
        ));
        return mongoTemplate.find(query, Dataset.class);
    }
} 