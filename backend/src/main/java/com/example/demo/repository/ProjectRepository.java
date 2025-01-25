package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.demo.entity.Project;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT p FROM Project p WHERE p.creator.id = :creatorId ORDER BY p.createdAt DESC")
    List<Project> findByCreatorIdOrderByCreatedAtDesc(@Param("creatorId") Long creatorId);
} 