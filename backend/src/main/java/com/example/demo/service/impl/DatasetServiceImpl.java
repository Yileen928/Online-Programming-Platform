package com.example.demo.service.impl;

import com.example.demo.entity.Dataset;
import com.example.demo.entity.User;
import com.example.demo.service.DatasetService;
import com.example.demo.service.UserService;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.mongodb.client.gridfs.GridFSDownloadStream;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DatasetServiceImpl implements DatasetService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Override
    public Dataset uploadDataset(MultipartFile file, String name, String description, String uploaderId) {
        User uploader = userService.getUserById(uploaderId);
        if (uploader == null) {
            throw new RuntimeException("上传者不存在");
        }

        // 验证文件类型
        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();
        if (contentType == null || originalFilename == null) {
            throw new RuntimeException("无效的文件");
        }

        // 检查文件扩展名
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        if (!isAllowedFileType(extension)) {
            throw new RuntimeException("不支持的文件类型，仅支持txt、doc、docx、xlsx和csv文件");
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
        // 设置文件类型前进行空值检查
        if (extension != null && !extension.isEmpty()) {
            dataset.setFileType(extension);
        } else {
            throw new RuntimeException("文件类型不能为空");
        }
        
        try {
            // 保存文件到GridFS
            DBObject metaData = new BasicDBObject();
            metaData.put("type", extension);
            metaData.put("uploadTime", LocalDateTime.now());
            metaData.put("collection", "datasets");
            metaData.put("datasetId", dataset.getId());
            
            ObjectId fileId = gridFsTemplate.store(
                file.getInputStream(),
                originalFilename,
                contentType,
                metaData
            );
            
            dataset.setFileId(fileId.toString());
            dataset.setStatus("COMPLETED");
            
            // 确保保存到datasets集合
            return mongoTemplate.save(dataset, "datasets");
        } catch (IOException e) {
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }

    private boolean isAllowedFileType(String extension) {
        return extension.equals("txt") || 
               extension.equals("doc") || 
               extension.equals("docx") || 
               extension.equals("xlsx") || 
               extension.equals("csv");
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
        Dataset dataset = getDataset(id);
        if (dataset != null && dataset.getId() != null) {
            // 删除GridFS中的文件
            gridFsTemplate.delete(Query.query(Criteria.where("_id").is(new ObjectId(dataset.getId()))));
        }
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

    @Override
    public byte[] downloadDataset(String id) {
        Dataset dataset = getDataset(id);
        if (dataset == null || dataset.getFileId() == null) {
            throw new RuntimeException("数据集不存在或文件未找到");
        }

        com.mongodb.client.gridfs.GridFSDownloadStream downloadStream = null;
        try {
            GridFSFile gridFsFile = gridFsTemplate.findOne(Query.query(Criteria.where("_id").is(new ObjectId(dataset.getFileId()))));
            if (gridFsFile == null) {
                throw new RuntimeException("文件不存在");
            }

            GridFsResource resource = gridFsTemplate.getResource(gridFsFile);
            downloadStream = resource.getContent();
            byte[] content = StreamUtils.copyToByteArray(downloadStream);

            // 更新下载次数
            dataset.setDownloads(dataset.getDownloads() + 1);
            updateDataset(dataset.getId(), dataset);

            return content;
        } catch (IOException e) {
            throw new RuntimeException("文件下载失败: " + e.getMessage());
        } finally {
            // 确保资源被正确释放
            try {
                if (downloadStream != null) {
                    downloadStream.close();
                }
            } catch (IOException e) {
                // 记录关闭流时的错误，但不抛出异常
                System.err.println("关闭下载流时发生错误: " + e.getMessage());
            }
        }
    }
}