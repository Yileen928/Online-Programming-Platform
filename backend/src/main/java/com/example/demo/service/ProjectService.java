package com.example.demo.service;

import com.example.demo.dto.ProjectCreateRequest;
import com.example.demo.entity.User;
import com.example.demo.entity.Project;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional
    public Project createProject(ProjectCreateRequest request, Long userId) {
        log.debug("Creating project for user ID: {}", userId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setTemplate(request.getTemplate());
        project.setPublic(request.isPublic());
        project.setUser(user);
        project.setCreatedAt(LocalDateTime.now());
        
        log.debug("Saving project: {}", project);
        return projectRepository.save(project);
    }
} 