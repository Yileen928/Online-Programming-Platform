package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.repository.ProjectFileRepository;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.entity.ProjectFile;
import com.example.demo.entity.Project;
import java.util.List;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class ProjectFileService {

    @Autowired
    private ProjectFileRepository projectFileRepository;
    
    @Autowired
    private ProjectRepository projectRepository;

    public List<ProjectFile> getProjectFiles(Long projectId) {
        log.debug("获取项目文件列表: projectId={}", projectId);
        projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("项目不存在"));
        return projectFileRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    public ProjectFile getFileContent(Long projectId, Long fileId) {
        log.debug("获取文件内容: projectId={}, fileId={}", projectId, fileId);
        return projectFileRepository.findByIdAndProjectId(fileId, projectId)
            .orElseThrow(() -> new RuntimeException("文件不存在"));
    }

    public void saveFileContent(Long projectId, Long fileId, String content) {
        log.debug("保存文件内容: projectId={}, fileId={}", projectId, fileId);
        ProjectFile file = projectFileRepository.findByIdAndProjectId(fileId, projectId)
            .orElseThrow(() -> new RuntimeException("文件不存在"));
        file.setContent(content);
        projectFileRepository.save(file);
    }

    public ProjectFile createFile(Long projectId, String name, String language) {
        log.debug("创建新文件: projectId={}, name={}, language={}", projectId, name, language);
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("项目不存在"));
            
        ProjectFile file = new ProjectFile();
        file.setName(name);
        file.setLanguage(language);
        file.setProject(project);
        file.setContent("");
        
        return projectFileRepository.save(file);
    }
} 