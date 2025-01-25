package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.entity.Project;
import com.example.demo.entity.User;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Project createProject(String name, String template, boolean isPublic, Long userId) {
        User creator = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("用户不存在"));
            
        Project project = new Project();
        project.setName(name);
        project.setTemplate(template);
        project.setPublic(isPublic);
        project.setCreator(creator);
        
        return projectRepository.save(project);
    }

    public List<Project> getRecentProjectsByUserId(Long userId) {
        return projectRepository.findByCreatorIdOrderByCreatedAtDesc(userId);
    }
} 