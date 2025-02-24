package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.ProjectFile;
import java.util.List;
import java.util.Optional;

public interface ProjectFileRepository extends JpaRepository<ProjectFile, Long> {
    List<ProjectFile> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    Optional<ProjectFile> findByIdAndProjectId(Long id, Long projectId);
} 