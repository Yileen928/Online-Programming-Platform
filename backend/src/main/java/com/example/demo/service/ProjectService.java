package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.entity.Project;
import com.example.demo.entity.User;
import com.example.demo.util.JwtUtil;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ProjectService {

    private static final Logger log = LoggerFactory.getLogger(ProjectService.class);

    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    public Project createProject(String name, String template, boolean isPublic, String token) {
        try {
            log.debug("开始创建项目，token: {}", token);
            
            // 从token中获取用户ID
            Long userId = jwtUtil.getUserIdFromToken(token);
            log.debug("获取到用户ID: {}", userId);
            
            User creator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
                
            Project project = new Project();
            project.setName(name);
            project.setTemplate(template);
            project.setPublic(isPublic);
            project.setCreator(creator);
            project.setCreatedAt(LocalDateTime.now());
            project.setUpdatedAt(LocalDateTime.now());
            
            Project savedProject = projectRepository.save(project);
            log.debug("项目创建成功: {}", savedProject.getId());
            return savedProject;
        } catch (Exception e) {
            log.error("创建项目失败", e);
            throw new RuntimeException("创建项目失败: " + e.getMessage(), e);
        }
    }

    public List<Project> getRecentProjectsByToken(String token) {
        String cleanToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserIdFromToken(cleanToken);
        return projectRepository.findByCreatorIdOrderByCreatedAtDesc(userId);
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }
    
    public List<Project> getAllProjects() {
        // 默认按创建时间降序排列
        return projectRepository.findAllByOrderByCreatedAtDesc();
    }

    public Project updateProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public void batchDeleteProjects(List<Long> projectIds) {
        projectRepository.deleteAllById(projectIds);
    }
} 