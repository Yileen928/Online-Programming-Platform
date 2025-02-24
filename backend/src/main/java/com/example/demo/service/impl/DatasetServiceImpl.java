package com.example.demo.service.impl;

import com.example.demo.entity.Dataset;
import com.example.demo.entity.User;
import com.example.demo.exception.DatasetException;
import com.example.demo.service.DatasetService;
import com.example.demo.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class DatasetServiceImpl implements DatasetService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Value("${dataset.file.max-size:104857600}") // 默认100MB
    private long maxFileSize;

    @Value("${dataset.file.allowed-types:csv,txt,json}")
    private String[] allowedFileTypes;

    @Override
    @Transactional
    public Dataset uploadDataset(MultipartFile file, String name, String description, String uploaderId) {
        try {
            // 验证参数
            validateUploadParams(file, name, uploaderId);
            
            // 获取上传者信息
            User uploader = Optional.ofNullable(userService.getUserById(uploaderId))
                .orElseThrow(() -> new DatasetException("上传者不存在"));

            // 创建数据集对象
            Dataset dataset = Dataset.builder()
                .name(name)
                .description(description)
                .uploader(uploader)
                .uploaderName(uploader.getUsername())
                .uploadTime(LocalDateTime.now())
                .downloads(0L)
                .likes(0L)
                .comments(0L)
                .size(file.getSize())
                .status("PROCESSING")
                .build();

            // 保存文件
            String fileId = saveFile(file);
            dataset.setFileId(fileId);
            dataset.setStatus("COMPLETED");

            // 保存数据集信息
            Dataset savedDataset = mongoTemplate.save(dataset);
            log.info("数据集上传成功: {}", savedDataset.getId());
            return savedDataset;

        } catch (Exception e) {
            log.error("数据集上传失败", e);
            throw new DatasetException("数据集上传失败: " + e.getMessage());
        }
    }

    @Override
    public Dataset getDataset(String id) {
        return Optional.ofNullable(mongoTemplate.findById(id, Dataset.class))
            .orElseThrow(() -> new DatasetException("数据集不存在"));
    }

    @Override
    public Page<Dataset> getAllDatasets(Pageable pageable) {
        Query query = new Query().with(pageable);
        long total = mongoTemplate.count(query, Dataset.class);
        List<Dataset> datasets = mongoTemplate.find(query, Dataset.class);
        return new org.springframework.data.domain.PageImpl<>(datasets, pageable, total);
    }

    @Override
    @Transactional
    public void deleteDataset(String id) {
        Dataset dataset = getDataset(id);
        try {
            // 删除GridFS中的文件
            gridFsTemplate.delete(Query.query(Criteria.where("_id").is(dataset.getFileId())));
            // 删除数据集记录
            mongoTemplate.remove(dataset);
            log.info("数据集删除成功: {}", id);
        } catch (Exception e) {
            log.error("数据集删除失败", e);
            throw new DatasetException("数据集删除失败: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Dataset updateDataset(String id, Dataset dataset) {
        // 验证数据集是否存在
        getDataset(id);
        dataset.setId(id);
        return mongoTemplate.save(dataset);
    }

    @Override
    public Page<Dataset> searchDatasets(String keyword, Pageable pageable) {
        Query query = new Query();
        if (StringUtils.hasText(keyword)) {
            query.addCriteria(new Criteria().orOperator(
                Criteria.where("name").regex(keyword, "i"),
                Criteria.where("description").regex(keyword, "i")
            ));
        }
        query.with(pageable);
        
        long total = mongoTemplate.count(query, Dataset.class);
        List<Dataset> datasets = mongoTemplate.find(query, Dataset.class);
        return new org.springframework.data.domain.PageImpl<>(datasets, pageable, total);
    }

    @Override
    public byte[] getFileContent(String fileId) {
        try {
            GridFsResource gridFsResource = gridFsTemplate.getResource(fileId);
            if (gridFsResource == null || !gridFsResource.exists()) {
                throw new DatasetException("文件不存在");
            }
            return gridFsResource.getInputStream().readAllBytes();
        } catch (IOException e) {
            log.error("获取文件内容失败", e);
            throw new DatasetException("获取文件内容失败: " + e.getMessage());
        }
    }

    private void validateUploadParams(MultipartFile file, String name, String uploaderId) {
        if (file == null || file.isEmpty()) {
            throw new DatasetException("文件不能为空");
        }
        if (!StringUtils.hasText(name)) {
            throw new DatasetException("数据集名称不能为空");
        }
        if (!StringUtils.hasText(uploaderId)) {
            throw new DatasetException("上传者ID不能为空");
        }
        if (file.getSize() > maxFileSize) {
            throw new DatasetException("文件大小超过限制");
        }
        String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        if (!Arrays.asList(allowedFileTypes).contains(fileExtension)) {
            throw new DatasetException("不支持的文件类型");
        }
    }

    private String saveFile(MultipartFile file) throws IOException {
        return gridFsTemplate.store(
            file.getInputStream(),
            file.getOriginalFilename(),
            file.getContentType()
        ).toString();
    }
} 